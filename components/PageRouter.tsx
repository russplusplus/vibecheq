import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import CameraPage from './CameraPage';
import ReviewPhoto from './ReviewPhoto';

export default function PageRouter() {
    const [page, setPage] = useState<String | null>('CameraPage')
    const [imageUri, setImageUri] = useState<String | null>(null)

    // useEffect(() => {
    //     console.log('rendered PageRouter')
    // })
    

    switch (page) {
        case 'CameraPage':
            return (
                <CameraPage 
                    setPage={setPage}
                    setImageUri={setImageUri}
                />
            )
        case 'ReviewPhoto':
            return (
                <ReviewPhoto 
                    setPage={setPage}
                    imageUri={imageUri}
                />
            )
        default:
            return (
                <CameraPage 
                    setPage={setPage}
                    setImageUri={setImageUri}
                />
            )
    }
}