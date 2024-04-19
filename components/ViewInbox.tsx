import React, { useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text, Platform, TextInput, ActivityIndicator, ImageBackground } from 'react-native'
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

export default function ViewInbox() {
  const [loading, setLoading] = useState<boolean>(false)
  const { user } = useContainerContext()
  const [userData, setUserData] = useState<any | null>(null)

  function handlePressAnywhere() {

  }

  return (

    <View
      style={styles.container}
    >
      <LoadingModal
        loading={loading}
      />

      <TouchableWithoutFeedback onPress={handlePressAnywhere}>
        <ImageBackground>
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
              <AntDesign name="heart" size={30} color={'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePhoto}
              style={styles.takePhoto}
            />
            <TouchableOpacity
              style={styles.inbox}>
              {isInboxLoading
                ? <ActivityIndicator size="small" color='black' />
                : <Text
                    style={styles.inboxText}
                  >{userData?.data ? Object.keys(userData.data.inbox).length : 0}</Text>
              }
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </TouchableWithoutFeedback>
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
