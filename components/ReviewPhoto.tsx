import React, { useEffect } from 'react';
import { Modal, ImageBackground, TouchableOpacity, View, Text, StyleSheet } from 'react-native';

export default function ReviewPhoto({ 
    setPage,
    imageUri 
}) {

    async function sendPhoto() {
        console.log('sending photo')
    }

    useEffect(() => {
        console.log('rendered ReviewPhoto')
    })

    return (
            <ImageBackground source={{uri: imageUri}} style={styles.background}>
                <View style={styles.bottomButtons}>
                    <TouchableOpacity style={{flex: 1}} onPress={() => setPage('CameraPage')}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => sendPhoto()}>
                        <Text style={{ color: 'white', fontSize: 16 }}>Save</Text>
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
        width: '100%',
    },
});