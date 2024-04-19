import React, { useState, useEffect } from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Platform } from 'react-native';
import CameraPage from './CameraPage';
import ReviewPhoto from './ReviewPhoto';
import ViewInbox from './ViewInbox';
import { useContainerContext } from './ContainerContext';

export default function PageRouter() {
    const { page, setPage, capturedImageUri, setCapturedImageUri } = useContainerContext()

    switch (page) {
        case 'CameraPage':
            return (
                <CameraPage />
            )
        case 'ReviewPhoto':
            return (
                <ReviewPhoto />
            )
        case 'ViewInbox':
            return (
                <ViewInbox />
            )
        default:
            return (
                <CameraPage />
            )
    }
}