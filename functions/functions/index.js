const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const {Storage} = require('@google-cloud/storage');
const gcs = new Storage({keyFilename: './service-account.json'});

exports.addUser = functions.auth.user().onCreate(user => {
  console.log('user:', user)
  admin
  .database()
  .ref(`users/${user.uid}/data`)
  .set({
    unbanTime: 0,
    email: user.email,
    phoneNumber: user.phoneNumber,
    settings: {
      leftHandedMode: false
    },
    vibeRecord: {
      strikes: 0,
      lastVibeReported: 0,
      firstVibe: 1,
      numberOfTimesBanned: 0
    },
  });
});

exports.addImage = functions.storage.object('/images').onFinalize(async (object) => {
  console.log('in add image function. storage object:', object)

  // Sender UID and isResponding are attached as metadata to storage object
  console.log('object.metadata.fromUid:', object.metadata.fromUid)
  let senderUid = object.metadata.fromUid

  // 'images/xxxxxxx' => 'xxxxxxx'
  let filename = object.name.substring(7)

  // generate signed URL for uploaded image
  const bucket = gcs.bucket("vibecheque-543ff.appspot.com");
  console.log('bucket:', bucket)
  const file = bucket.file(object.name);
  console.log('file:', file)
  const urlArr = await file.getSignedUrl({
    action: 'read',
    expires: '03-09-2491'
  })
  const url = urlArr[0]
  console.log('url:', url)


  const isResponse = object.metadata.toUid ? true : false

  if (isResponse) {
    console.log('vibe has recipient metadata and therefore is a response. toUid:', object.metadata.toUid)
  } else {
    console.log('vibe does not have recipient metadata and therefore is not a response')
  }

  const randomRecipientUid = async () => {
    let snapshot = await admin  
      .database()
      .ref('users')
      .once('value')
    let users = snapshot.val()
    console.log('snapshot:', users)
    let uidArr = []
    for (let user in users) {
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

  let recipientUid = isResponse ? object.metadata.toUid : await randomRecipientUid()
  
  // add entry to database
  console.log('recipientUid:', recipientUid)
  console.log('senderUid:', senderUid)
  admin
    .database()
    .ref(`users/${recipientUid}/data/inbox/${filename}`)
    .set({
      from: senderUid,
      to: recipientUid, // is this necessary?
      isResponse: isResponse,
      url: url,
      respondingToImageName: object.metadata.respondingToImageName || null,
      respondingToImageUrl: object.metadata.respondingToImageUrl || null
    })

  // send FCM
  let recipientToken = users[recipientUid].registrationToken
  console.log('response block recipientToken:', recipientToken)
  let payload = {
    notification: {
      title: isResponse ? 'New response!' : 'New Vibe!',
      body: 'Open Vibecheq to view it',
      imageUrl: 'https://my-cdn.com/app-logo.png',
    },
    token: recipientToken
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
});