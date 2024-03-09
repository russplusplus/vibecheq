import React, { useState, useEffect } from 'react';
import { Modal, ImageBackground, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Styles, Colors } from '../lib/constants'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome6 } from '@expo/vector-icons';
import { supabase } from '../lib/supabase'

interface StorageData {
    fullPath: string,
    id: string,
    path: string
}

async function uploadPhoto(uri: string) {
    return new Promise(async (resolve, reject) => {
        console.log('in uploadPhoto')
        const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer())
        const imageName = Date.now().toString() + '.jpg'
        console.log('imageName:', imageName)
        const { data, error: uploadError } = await supabase.storage
            .from('photos')
            .upload(imageName, arrayBuffer, {
                contentType: 'image/jpeg',
            })

        if (uploadError) {
            console.log('storage uploadError:', uploadError)
            reject(uploadError)
        }

        console.log('storage upload data:', data)
        resolve(data)
    })
}

function hanldePhotoUpload(imageName: string) {
    console.log('in handlePhotoUpload')
    return new Promise(async (resolve, reject) => {
        const { data, error } = await supabase.functions.invoke('handle-photo', {
            headers: {
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
                // 'Content-Type': null
            },
            body: imageName
        })

        if (error) {
            console.log('handle-photo error:', error)
            reject(error)
        }

        console.log('handle-photo data:', data)
        resolve(data)
    })
}

export default function ReviewPhoto({
    setPage,
    imageUri
}) {
    const [loading, setLoading] = useState<boolean>(false)

    async function sendPhoto() {
        setLoading(true)
        console.log('sending photo')
        
        // "as StorageData" is a type assertion
        const storageData = await uploadPhoto(imageUri) as StorageData
        console.log('storageData:', storageData)
        await hanldePhotoUpload(storageData.path)
        
        setLoading(false)
        setPage('CameraPage')
    }

    useEffect(() => {
        console.log('rendered ReviewPhoto')
    })

    return (
        <ImageBackground source={{ uri: imageUri }} style={styles.background}>
            <View style={styles.bottomButtons}>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setPage('CameraPage')}>
                    <FontAwesome6 name="xmark" size={34} color="black" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => sendPhoto()} style={styles.sendButton}>
                    {loading 
                        ? <ActivityIndicator size={'large'} color="black"/>
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