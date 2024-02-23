import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { UserContextProvider, useUser } from './components/UserContext'
import PageRouter from './components/PageRouter'
import Auth from './components/Auth'
import { Styles, Colors } from './lib/constants'

const Container = () => {
  const { user } = useUser()
  console.log('user:', user)
  return user ? <PageRouter /> : <Auth />
}

export default function App() {
  return (
    <UserContextProvider>
        <View style={styles.container}>
          <Container />
          <StatusBar style="auto" />
        </View>
    </UserContextProvider>
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
