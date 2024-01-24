import React from 'react'
import { Alert, StyleSheet, View, Text } from 'react-native'
import { Button } from 'react-native-elements'
import { supabase } from '../lib/supabase'

export default function Camera() {

    async function signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) {
            Alert.alert(error.message)
            return
        }
    }

    return (
        <View>
            <Text>Camera page :3</Text>
            <Button title="Sign Out" onPress={signOut} />
        </View>
    )
}