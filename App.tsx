import React, { useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { ContainerContextProvider, useContainerContext } from './components/ContainerContext'
import PageRouter from './components/PageRouter'
import Auth from './components/Auth'
import { Styles, Colors } from './lib/constants'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Container = () => {
  const { user, setUser } = useContainerContext()

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
    // backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
});
