import database from '@react-native-firebase/database'

export async function getUserData(uid: string): Promise<any>  {
  console.log('in getUserData. uid:', uid)
  return new Promise(async (resolve, reject) => {
    const ref = `userData/${uid}`
    try {
      const snapshot = await database()
      .ref(ref)
      .once('value')
      const userData = await snapshot.val()
      console.log('in getUserData. user:', userData)
      if (!userData) {
          console.log('user data not found')
          reject('user data not found')
      } else {
          console.log('phoneNumber found, so setting user data')
          resolve(userData)
      } 
    } catch (err) {
      console.log('getUserData error:', err)
    }
  })
}