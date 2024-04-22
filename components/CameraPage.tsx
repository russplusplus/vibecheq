import React, { useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, Text, Platform, TextInput, ActivityIndicator, Image, PermissionsAndroid } from 'react-native'
import { Styles, Colors } from '../lib/constants'
// import { supabase } from '../lib/supabase'
import { Camera, CameraType } from 'expo-camera';

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
    if (!user?.data) {
        console.log('user data not found')
        reject('user data not found')
    } else {
        console.log('phoneNumber found, so setting user data')
        resolve(user)
    } 
  })
}

export default function CameraPage() {

  const [type, setType] = useState(CameraType.back)
  const [logoutMode, setLogoutMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [isInboxLoading, setIsInboxLoading] = useState<boolean>(false)
  const cameraRef = useRef<Camera>(null)

  const { user, setCapturedImageUri, setPage, userData, setUserData, respondingTo, setRespondingTo } = useContainerContext()

  const [permission, requestPermission] = Camera.useCameraPermissions()

  if (!permission?.granted) {
    requestPermission()
  }

  function toggleCameraType() {
    console.log('in toggleCameraType')
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
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
    if (userData.data.inbox) {
      setPage('ViewInbox')
    } else {
      setIsInboxLoading(true)
      await init()
      setIsInboxLoading(false)
    }
  }

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
        type={type}
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
              source={{ uri: userData.data.inbox[Object.keys(userData.data.inbox)[0]].url }}
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
    height: 210,
    width: 120,
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
