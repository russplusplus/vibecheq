// import React, { useEffect } from 'react'
import { Modal, View, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native'
// import { supabase } from '../lib/supabase'
import { Styles, Colors } from '../lib/constants'


export default function Logout({
    logoutMode,
    setLogoutMode
}) {
    async function signOut() {
        // const { error } = await supabase.auth.signOut()
        // if (error) {
        //     Alert.alert(error.message)
        //     return
        // }
    }

    // useEffect(() => {
    //     console.log('rendered Logout')
    // })

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={logoutMode}
            style={styles.modal}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <View style={styles.modalContainer}>
                    <Text style={styles.text}>Log out?</Text>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            signOut()
                        }}
                    >
                        <Text style={{fontSize: Styles.fontNormal}}>Yes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setLogoutMode(!logoutMode)}
                    >
                        <Text style={{fontSize: Styles.fontNormal}}>No</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        
    },
    container: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center', 
        backgroundColor: 'rgba(1, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        height: '60%',
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8
    },
    text: {
        fontSize: Styles.fontNormal,
        color: Colors.white
    },
    button: {
        marginTop: 20,
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