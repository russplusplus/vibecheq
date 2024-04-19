import React, { useState, useEffect } from 'react';
import { Modal, ImageBackground, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Styles, Colors } from '../lib/constants'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
// import { supabase } from '../lib/supabase'
import storage from '@react-native-firebase/storage';

import { useContainerContext } from './ContainerContext'

async function uploadPhoto(uri: string, userUid: string, recipient: string) {
    return new Promise(async (resolve, reject) => {
        console.log('in uploadPhoto')
        const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer())

        try {
            let filename = new Date().getTime();
            console.log('userUid:', userUid)
            console.log('filename:', filename)
            const refName = 'images/' + String(filename)
            console.log('refName:', refName)
            const ref = storage().ref(refName);
            console.log('ref:', ref)
            const metadata = {
                customMetadata: {
                    fromUid: userUid,
                    toUid: recipient,
                    didTheyFavorite: 'false'
                }
            }
            console.log('uri:', uri)
            const res = await ref.putFile(uri, metadata);
            resolve(res)
        } catch (error) {
            console.log('error:', error)
            reject(error)
        }
    })
}

export default function ReviewPhoto(): React.JSX.Element {
    const [loading, setLoading] = useState<boolean>(false)
    const { user, setUser, capturedImageUri, setPage } = useContainerContext()

    async function sendPhoto() {
        setLoading(true)
        console.log('sending photo')
        let recipient = null
        // "as StorageData" is a type assertion
        const storageData = await uploadPhoto(capturedImageUri, user.user.uid, recipient)
        console.log('storageData:', storageData)
        // await handlePhotoUpload(storageData.path)

        setLoading(false)
        setPage('CameraPage')
    }

    useEffect((): void => {
        console.log('rendered ReviewPhoto')
    })

    return (
        <ImageBackground source={{ uri: capturedImageUri }} style={styles.background}>
            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setPage('CameraPage')}>
                    <FontAwesome6 name="xmark" size={34} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={sendPhoto} style={styles.sendButton}>
                    {loading
                        ? <ActivityIndicator size={'large'} color="black" />
                        : <MaterialCommunityIcons name="send" size={34} color="black" />
                    }
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-end',
    },
    bottomButtons: {
        flex: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        // width: '100%',
        marginHorizontal: 16,
        marginBottom: 16,
    },
    cancelButton: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.blue,
        justifyContent: 'center',
        alignItems: 'center'
    }

});