import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { ContainerContextProvider, useContainerContext } from './components/ContainerContext'
import PageRouter from './components/PageRouter'
import Auth from './components/Auth'
import { Styles, Colors } from './lib/constants'
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications'
import { getUserData } from './lib/utils'

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const Container = () => {
  const { user, setUser, setUserData } = useContainerContext()

  async function checkIfLoggedIn() {
    console.log('in checkIfLoggedIn')
    try {
      const user = JSON.parse(await AsyncStorage.getItem('user'))
      if (user) {
        console.log('user found in AsyncStorage')
        setUser(user)
      } else {
        console.log('no user item found in AsyncStorage')
      }
    } catch (error) {
      console.log('no user item found in AsyncStorage')
      console.log('error:', error)
    }
  }

  useEffect(() => {
    checkIfLoggedIn()
  }, [])  

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('Received FCM:', remoteMessage)
      console.log('user:', user)
      const data = await getUserData(user.user.uid)
      setUserData(data)
    });
    return unsubscribe;
  }, []);
  
  console.log('in App.tsx. user:', user)
  return user ? <PageRouter /> : <Auth />
}

export default function App() {
  return (
    <ContainerContextProvider>
        <View style={styles.container}>
          <Container />
          <StatusBar style="auto" />
        </View>
    </ContainerContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
});
