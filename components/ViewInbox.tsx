import React, { useState, useEffect, useRef } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, TouchableWithoutFeedback, Text, Platform, TextInput, ActivityIndicator, ImageBackground } from 'react-native'

import LoadingModal from './LoadingModal'

import { useContainerContext } from './ContainerContext'

export default function ViewInbox() {
  const [loading, setLoading] = useState<boolean>(false)
  const { user, setPage, respondingTo, setRespondingTo, userData } = useContainerContext()

  console.log('ViewInbox userData:', userData)

  function handlePressAnywhere() {
    console.log('in handlePressAnywhere')
    setPage('CameraPage')
  }

  useEffect(() => {
    if (userData.data.inbox[Object.keys(userData.data.inbox)[0]].isResponse) {
      setRespondingTo(null)
    } else {
      setRespondingTo(userData.data.inbox[Object.keys(userData.data.inbox)[0]].from)
    }
  }, [])

  useEffect(() => {
    console.log('in ViewInbox. userData:', userData)
  }, [])

  return (

    <View
      style={styles.container}
    >
      <LoadingModal
        loading={loading}
      />

      <TouchableWithoutFeedback onPress={handlePressAnywhere}>
        <ImageBackground
          style={styles.background}
          source={{ uri: userData.data.inbox[Object.keys(userData.data.inbox)[0]].url }}
        >
          
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
  background: {
    flex: 1
  }
})
