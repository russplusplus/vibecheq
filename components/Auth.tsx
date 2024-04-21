import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, Text, Platform, TextInput, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'
import { Styles, Colors } from '../lib/constants'
import AsyncStorage from '@react-native-async-storage/async-storage'

import PhoneInput, { ICountry } from 'react-native-international-phone-number'
import auth from '@react-native-firebase/auth';
import { useContainerContext } from './ContainerContext'

export default function Auth() {
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [passcodeSent, setPasscodeSent] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [confirm, setConfirm] = useState<any>(null)

  const { user, setUser } = useContainerContext()

  async function sendOtp() {
    setLoading(true)
    const fullPhoneNumber = selectedCountry?.callingCode + ' ' + phoneNumber
    console.log('in sendOtp. fullPhoneNumber:', fullPhoneNumber)

    // const { data, error } = await supabase.auth.signInWithOtp({
    //   phone: selectedCountry?.callingCode + phone,
    // })
    // if (error) {
    //   if (error.message?.includes('Invalid phone number') || error.message?.includes("Invalid 'To' Phone Number")) {
    //     setError('Please enter a valid phone number')
    //   } else {
    //     setError('An error occurred')
    //   }
    //   setLoading(false)
    //   console.log(error.message)
    //   return
    // }

    const confirmation = await auth().signInWithPhoneNumber(fullPhoneNumber);
    console.log('confirmation:', confirmation)
    setConfirm(confirmation)
    setPasscodeSent(true)
    setLoading(false)
    setError('')
  }

  async function verifyOtp() {
    setLoading(true)
    // const { data: { session }, error } = await supabase.auth.verifyOtp({
    //   phone: selectedCountry?.callingCode + phone,
    //   token: password,
    //   type: 'sms'
    // })

    const user = await confirm.confirm(password)
    const { uid } = user.user
    console.log('code is valid! user:', user)
    //updateRegistrationToken(uid)
    setUser(user)
    await AsyncStorage.setItem("user", JSON.stringify(user))

    setLoading(false)
    setError('')
  }

  useEffect(() => {
    console.log('rendered Auth')
  })

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/title.png')}
        style={styles.title}
      />
      <Text style={{ color: Colors.orange, fontSize: Styles.fontNormal, marginBottom: 4 }}>{error}</Text>
      {passcodeSent ?
        <>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setPassword(text)}
              value={password}
              placeholder="passcode"
              autoCapitalize='none'
              keyboardType="numeric"
            />
          </View>
          <View >
            <TouchableOpacity
              onPress={() => verifyOtp()}
              style={styles.button}
            >
              {loading
              ? <ActivityIndicator size="large" color='black' /> 
              : <Text style={{ fontSize: Styles.fontNormal }}>verify passcode</Text>
              }
            </TouchableOpacity>
          </View>
        </>
        :
        <>
          <View style={styles.inputContainer}>
            <PhoneInput
              phoneInputStyles={phoneInputStyles}
              modalStyles={modalStyles}
              onChangePhoneNumber={(value: string) => setPhoneNumber(value)}
              value={phoneNumber}
              selectedCountry={selectedCountry}
              onChangeSelectedCountry={(value: ICountry) => setSelectedCountry(value)}
              defaultCountry='US'
              placeholder='phone number'
            />
          </View>
          <View >
            <TouchableOpacity
              onPress={() => sendOtp()}
              style={styles.button}
            >
              {loading 
              ? <ActivityIndicator size="large" color='black' /> 
              : <Text style={{ fontSize: Styles.fontNormal }}>Send passcode</Text>
              }
            </TouchableOpacity>
          </View>
        </>
      }
    </View>
  )
}

const modalStyles = {
  modal: {
    backgroundColor: Colors.black
  },
  searchInput: {
    color: 'black',
    fontSize: Styles.fontNormal,
  },
  countryButton: {
    backgroundColor: Colors.white,
    borderWidth: 0
  },
  callingCode: {
    color: 'black',
    fontSize: Styles.fontNormal,
    marginHorizontal: 0,
  },
  countryName: {
    color: 'black',
    fontSize: Styles.fontNormal,
  }
}

const phoneInputStyles = {
  container: {
    backgroundColor: Colors.white,
    borderWidth: 0,
    borderColor: '#F3F3F3',
    fontColor: 'black',
    height: 45,
  },
  flagContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
  },
  flag: {
  },
  caret: {
    color: 'black',
    fontSize: Styles.fontNormal,
  },
  divider: {
    backgroundColor: 'black',
  },
  callingCode: {
    fontSize: Styles.fontNormal,
    color: 'black',
    fontWeight: 'normal',
  },
  input: {
    fontSize: Styles.fontNormal,
    paddingHorizontal: 0,
  },
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
  },
  title: {
    marginTop: 200,
    marginBottom: 6,
    width: '100%',
    height: 100
  },
  inputLabel: { 
    color: Colors.white, 
    fontSize: Styles.fontNormal,
    marginBottom: 0
  },
  inputContainer: {
    width: 300,
  },
  input: {
    backgroundColor: Colors.white,
    paddingVertical: 0,
    paddingHorizontal: 12,
    height: 45,
    fontSize: Styles.fontNormal,
    borderRadius: 8,
  },
  button: {
    marginVertical: 20,
    paddingVertical: 4,
    paddingHorizontal: 4,
    width: 250,
    height: 38,
    backgroundColor: Colors.white,
    alignItems: 'center',
    fontSize: Styles.fontLarge,
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'center'
  }
})
