import React, { useEffect } from 'react'
import { Modal, View, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native'
import { Styles, Colors } from '../lib/constants'


export default function LoadingModal({
    loading
}) {

    useEffect(() => {
        console.log('rendered LoadingModal')
    })

    return (
        <Modal
            transparent={true}
            visible={loading}
            style={styles.modal}
            statusBarTranslucent
        >
            <View style={styles.container}>
                <ActivityIndicator size={'large'} color={Colors.white}/>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modal: {
        
    },
    container: { 
        flex: 1,
        flexDirection: 'column',
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