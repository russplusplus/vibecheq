import React from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import { ThemeProvider, colors, Text } from 'react-native-elements'
import { UserContextProvider, useUser } from './components/UserContext'
import Camera from './components/Camera'
import Auth from './components/Auth'
import { Styles, Colors } from './lib/constants'

const theme = {
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
}

const Container = () => {
  const { user } = useUser()
  console.log('user:', user)
  return user ? <Camera /> : <Auth />
}

export default function App() {
  return (
    <UserContextProvider>
      <ThemeProvider theme={theme}>
        <View style={styles.container}>
          <Container />
          <StatusBar style="auto" />
        </View>
      </ThemeProvider>
    </UserContextProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
});
