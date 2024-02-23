import React, { useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, Text, Platform, TextInput } from 'react-native'
import { Styles, Colors } from '../lib/constants'
import { supabase } from '../lib/supabase'
import { Camera, CameraType } from 'expo-camera';

import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

import Logout from './Logout'
import LoadingModal from './LoadingModal'

export default function CameraPage({
  setPage,
  setImageUri
}) {

  const [type, setType] = useState(CameraType.back)
  const [logoutMode, setLogoutMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const cameraRef = useRef<Camera>(null)
  

  function toggleCameraType() {
    console.log('in toggleCameraType')
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back))
  }

  async function takePhoto() {
    setLoading(true)
    if (!cameraRef) return
    const photo = await cameraRef.current.takePictureAsync()
    setImageUri(photo.uri)
    setLoading(false)
    setPage('ReviewPhoto')
  }

  useEffect(() => {
    console.log('logoutMode:', logoutMode)
  }, [logoutMode])

  useEffect(() => {
    console.log('rendered CameraPage')
  })

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
            style={styles.bottomBottomButtons}>
            <TouchableOpacity
              style={styles.favorite}>
              <AntDesign name="heart" size={30} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhoto}
              style={styles.takePhoto}
            />
            <TouchableOpacity
              style={styles.inbox}>
              <Text
                style={styles.inboxText}
              >0</Text>
            </TouchableOpacity>
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
    marginBottom: 20,
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
  favorite: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.blue,
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
    color: Colors.black
  }
})
