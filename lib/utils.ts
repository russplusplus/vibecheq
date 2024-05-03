import database from '@react-native-firebase/database'

export async function getUserData(uid: string): Promise<any>  {
    return new Promise(async (resolve, reject) => {
      const ref = `users/${uid}`
      const snapshot = await database()
          .ref(ref)
          .once('value')
      const user = snapshot.val()
      console.log('in getUserData. snapshot.val():', user)
      if (!user?.data) {
          console.log('user data not found')
          reject('user data not found')
      } else {
          console.log('phoneNumber found, so setting user data')
          resolve(user)
      } 
    })
}