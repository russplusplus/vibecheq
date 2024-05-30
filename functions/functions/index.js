const functions = require('firebase-functions');
const admin = require('firebase-admin');

// This package (@google-cloud/storage) must be used instead of
// firebase-admin for storage, because it can create signed URLs
// that never expire. The firebase-admin sdk can only create 
// signed URLs that last up to a week.
const { Storage } = require('@google-cloud/storage');
const gcs = new Storage({keyFilename: './service-account.json'});
const { modelUrl, modelWeightUrls } = require('./constants')
const pdjs = require('private-detector-js')

admin.initializeApp();

exports.addUser = functions.auth.user().onCreate(user => {
  console.log('user:', user)
  admin
  .database()
  .ref(`userData/${user.uid}`)
  .set({
    phoneNumber: user.phoneNumber,
    settings: {
      leftHandedMode: false
    }
  });
});

const runtimeOpts = {
  timeoutSeconds: 300,
  memory: '2GB'
}

exports.addImage = functions.runWith(runtimeOpts).storage.object('/images').onFinalize(async (object) => {
  console.log('in addImage function')

  // The sender's UID (fromUid) and isResponding are attached as metadata to storage object
  console.log('object.metadata.fromUid:', object.metadata.fromUid)
  const senderUid = object.metadata.fromUid

  const imageUrl = await createSignedUrl(object.name)
  console.log('imageUrl:', imageUrl)

  if (await isImageExplicit(imageUrl)) {
    console.log('image is explicit')
    // TO DO
    // delete image if in production
    // log to database
    return
  }

  console.log('image is not explicit. Determining recipient...')

  const allUsersSnapshot = await admin.database().ref('registrationTokens').once('value')
  const allUsers = await allUsersSnapshot.val()

  console.log('object.metadata.toUid:', object.metadata.toUid)
  const isResponse = object.metadata.toUid ? true : false
  console.log('isResponse:', isResponse)
  const recipientUid = object.metadata.toUid ?? determineRecipientUid(allUsers, senderUid)
  console.log('recipientUid:', recipientUid)
  console.log('senderUid:', senderUid)

  const imageData = {
    from: senderUid,
    to: recipientUid, // is this necessary?
    isResponse: isResponse,
    url: imageUrl,
    respondingToImageName: object.metadata.respondingToImageName || null,
    respondingToImageUrl: object.metadata.respondingToImageUrl || null
  }

  await addDatabaseEntry(object.name.substring(7), imageData)
  
  await sendNotification(allUsers[recipientUid].registrationToken, isResponse)
});



async function createSignedUrl(filename) {
  const bucket = gcs.bucket("vibecheq-dev-d930b.appspot.com");
  // console.log('bucket:', bucket)
  const file = bucket.file(filename);
  // console.log('file:', file)
  const urlArr = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  const url = urlArr[0]
  return url
}

// remove async
async function getWeightUrls(shardName) {
  return modelWeightUrls[shardName]
}

async function isImageExplicit(imageUrl) {
  const options = {
    weightUrlConverter: getWeightUrls
  }

  const filePaths = [
    imageUrl
  ]

  const probs = await pdjs.RunInference(modelUrl, filePaths, options)
  console.log('probs:', probs)
  return (probs[0] > 0.1)
}

function determineRecipientUid(allUsers, senderUid) {
  console.log('no recipient UID found in metadata. Randomly assigning recipient...')
  console.log('allUsers:', allUsers)
  let uidArr = []
  for (let user in allUsers) {
    if (user != senderUid) {
      console.log('user', user, 'is a suitable recipient')
      uidArr.push(user)
    } else {
      console.log('user', user, 'is NOT a suitable recipient')
    }
  }
  console.log('uidArr:', uidArr)
  console.log('senderUid:', senderUid)
  const recipientUid = uidArr[Math.floor(Math.random() * uidArr.length)]
  console.log('recipientUid:', recipientUid)
  return recipientUid
}

async function createModelWeightSignedUrls(numberOfShards) {
  // created signedUrls for each shard file
  let weightUrls = {}
  for (let i = 1; i <= numberOfShards; i++) {
    const shardFile = bucket.file(`model/group1-shard${i}of${numberOfShards}.bin`)
    const shardUrlArr = await shardFile.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    })
    const shardUrl = shardUrlArr[0]
    weightUrls[`group1-shard${i}of${numberOfShards}.bin`] = shardUrl
  }
  console.log('weightUrls:', weightUrls)
}

async function addDatabaseEntry(imageFilename, imageData) {
  console.log('in addDatabaseEntry. imageData:', imageData)

  console.log('recipientUid:', imageData.to)
  console.log('senderUid:', imageData.from)
  admin
    .database()
    .ref(`userData/${imageData.to}/inbox/${imageFilename}`)
    .set(imageData)
}

async function sendNotification(recipientRegistrationToken, isResponse) {
  // send FCM
  console.log('response block recipientToken:', recipientRegistrationToken)
  let payload = {
    notification: {
      title: isResponse ? 'New response!' : 'New Vibe!',
      body: 'Open Vibecheq to view it',
      imageUrl: 'https://my-cdn.com/app-logo.png',
    },
    token: recipientRegistrationToken
  }
  admin
    .messaging()
    .send(payload)
    .then(function(response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
      console.log("Error sending message:", error);
  });
}