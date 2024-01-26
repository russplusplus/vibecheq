import React, { useState, useEffect } from 'react'
import { Alert, StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native'
import { Image } from 'expo-image'
import { Styles, Colors } from '../lib/constants'
import { supabase } from '../lib/supabase'

import { Button, Input } from 'react-native-elements'
import PhoneInput, { ICountry } from 'react-native-international-phone-number'

export default function Auth() {
  const [phone, setPhone] = useState<string>('')
  const [selectedCountry, setSelectedCountry] = useState<null | ICountry>(null);
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendOtp() {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: selectedCountry?.callingCode + phone,
    })
    if (error) {
      Alert.alert(error.message)
      console.log(error.message)
      return
    }
    console.log('data:', data)
    setLoading(false)
  }

  async function verifyOtp() {
    setLoading(true)
    const { data: { session }, error } = await supabase.auth.verifyOtp({
      phone: selectedCountry?.callingCode + phone,
      token: password,
      type: 'sms'
    })

    setLoading(false)
  }

  useEffect(() => {
    console.log('selectedCountry:', selectedCountry)
  }, [selectedCountry])

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/title.png')}
        style={styles.title}
      />
      <View style={[{ marginTop: 20 }]}>
        {/* <Input
          label="Phone Number"
          leftIcon={{ type: 'font-awesome', name: 'phone' }}
          onChangeText={(text) => setPhone(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={'none'}
        /> */}
        <PhoneInput
          style={styles.input}
          onChangePhoneNumber={(value: string) => setPhone(value)}
          value={phone}
          selectedCountry={selectedCountry}
          onChangeSelectedCountry={(value: ICountry) => setSelectedCountry(value)}
          defaultCountry='US'
        />
        
      </View>
      <View style={styles.input}>
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={'none'}
        />
      </View>
      <View style={[styles.button, { marginTop: 20 }]}>
        <TouchableOpacity
          onPress={() => sendOtp()}
        >
          <Text style={{fontFamily: 'Rubik-Regular', fontSize: Styles.fontNormal}}>Send OTP</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.button}>
        <TouchableOpacity
          onPress={() => verifyOtp()}
        >
          <Text style={{fontFamily: 'Rubik-Regular', fontSize: Styles.fontNormal}}>Verify OTP</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
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
    width: '100%', 
    height: 100
  },
  input: {
    width: 300
  },
  button: {
    marginVertical: 10,
    paddingVertical: 4,
    paddingHorizontal: 4,
    width: 250,
    backgroundColor: Colors.white,
    alignItems: 'center',
    fontSize: Styles.fontLarge
  }
})
