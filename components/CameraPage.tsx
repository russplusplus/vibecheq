import React, { useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, Text, Platform, TextInput, ActivityIndicator, Image } from 'react-native'
import { Styles, Colors } from '../lib/constants'
// import { supabase } from '../lib/supabase'
// import { Camera, CameraType } from 'expo-camera';
import { Camera, useCameraDevice } from 'react-native-vision-camera'

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import database from '@react-native-firebase/database'

import Logout from './Logout'
import LoadingModal from './LoadingModal'

import { useContainerContext } from './ContainerContext'

async function getUserData(uid: string): Promise<any>  {
  return new Promise(async (resolve, reject) => {
    const ref = `users/${uid}`
    // the auth trigger function takes a couple seconds to populate the new user data in the db, so we wait a couple seconds before querying it
    // 4 seconds works so far, may be able to go lower
    // UPDATE: this is not actually a problem. Not having the user data for a new user has no 
    // apparent consequences, since their inbox will be empty anyway
    // setTimeout function was eliminated
    const snapshot = await database()
        .ref(ref)
        .once('value')
    const user = snapshot.val()
    console.log('in getUserData. snapshot.val():', user)
    if (!user.data) {
        console.log('user data not found')
        reject('user data not found')
    } else {
        console.log('phoneNumber found, so setting user data')
        resolve(user)
    } 
  })
}

export default function CameraPage() {

  // const [type, setType] = useState(CameraType.back)
  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back')
  const [logoutMode, setLogoutMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isInboxLoading, setIsInboxLoading] = useState<boolean>(false)
  const cameraRef = useRef<Camera>(null)
  const device = useCameraDevice('back')

  const { user, setCapturedImageUri, setPage, userData, setUserData, respondingTo, setRespondingTo } = useContainerContext()

  function toggleCameraType() {
    console.log('in toggleCameraType')
    // setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'))

  }

  async function takePhoto() {
    setLoading(true)
    if (!cameraRef) return
    const photo = await cameraRef.current.takePictureAsync()
    setCapturedImageUri(photo.uri)
    setLoading(false)
    setPage('ReviewPhoto')
  }

  async function init() {
    if (!user) {
      console.log('user not found')
      return
    }
    const data = await getUserData(user.user.uid)
    setUserData(data)
  }

  async function viewInbox() {
    console.log('in viewInbox. userData.data:', userData.data)
    if (userData.data.inbox) {
      setPage('ViewInbox')
    } else {
      setIsInboxLoading(true)
    }
  }

  useEffect(() => {
    console.log('logoutMode:', logoutMode)
  }, [logoutMode])

  useEffect(() => {
    console.log('rendered CameraPage')
  })

  useEffect(() => {
    console.log('userData:', userData)
  }, [userData])

  useEffect(() => {
    init()
  }, [])

  return (

    <View
      style={styles.container}
    >
      <LoadingModal
        loading={loading}
      />
      <Logout
        logoutMode={logoutMode}
        setLogoutMode={setLogoutMode}
      />
      <Camera
        style={styles.camera}
        device={device}
        ref={cameraRef}
        onMountError={(err) => console.log('onMountError:', err)}
      >
        <View
          style={styles.topButtons}
        >
          <TouchableOpacity onPress={() => setLogoutMode(true)}>
            <Ionicons name="return-down-back" size={36} color={Colors.white}  />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="settings-outline" size={36} color={Colors.white}  />
          </TouchableOpacity>
        </View>
        <View
          style={styles.bottomButtons}
        >
          <View
            style={styles.bottomTopButtons}
          >
            <TouchableOpacity onPress={toggleCameraType}>
              <MaterialIcons name="cameraswitch" size={36} color={Colors.white} />
            </TouchableOpacity>
          </View>
          <View
            style={{...styles.bottomBottomButtons, justifyContent: respondingTo ? 'center' : 'space-between'}}>
            {respondingTo ?
            <Image
              // source={{ uri: userData.data.inbox[Object.keys(userData.data.inbox)[0]].url }}
              source={{ uri: 'data:image/jpeg;base64,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'}}
              style={styles.image}
            />
            :
            <TouchableOpacity
              style={styles.favorite}>
              <AntDesign name="heart" size={30} color={'transparent'} />
            </TouchableOpacity>
            }
            
            <TouchableOpacity
              onPress={takePhoto}
              style={styles.takePhoto}
            />
            {respondingTo ? 
            <></>
            :
            <TouchableOpacity
              onPress={viewInbox}
              style={styles.inbox}>
              {isInboxLoading
                ? <ActivityIndicator size="small" color='black' />
                : <Text
                    style={styles.inboxText}
                  >{userData?.data?.inbox ? Object.keys(userData.data.inbox).length : 0}</Text>
              }
            </TouchableOpacity>
            }
          </View>
        </View>
      </Camera>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '150%',
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: 'red'
  },
  camera: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'column',
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  topButtons: {
    flex: 0.2,
    flexDirection: 'row',
    marginHorizontal: 114,
    marginTop: 30,
    justifyContent: 'space-between'
  },
  bottomButtons: {
    flex: 0.2,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 114,
    marginBottom: 16,
  },
  bottomTopButtons: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bottomBottomButtons: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
  },
  image: {
    borderRadius: 5,
    height: 200,
    width: 100,
    position: 'absolute',
    left: 0,
    bottom: 0
  },
  favorite: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center'
  },
  takePhoto: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: Colors.white
  },
  inbox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inboxText: {
    fontSize: Styles.fontLarge,
    color: "black"
  }
})
