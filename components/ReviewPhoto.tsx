import React, { useState, useEffect } from "react";
import {
  Modal,
  ImageBackground,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { Styles, Colors } from "../lib/constants";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FontAwesome6 } from "@expo/vector-icons";
// import { supabase } from '../lib/supabase'
import storage from "@react-native-firebase/storage";
import database from '@react-native-firebase/database'

import { useContainerContext } from "./ContainerContext";

async function uploadPhoto(uri: string, userUid: string, recipient: string, respondingToImageName: string, respondingToImageUrl: string) {
  return new Promise(async (resolve, reject) => {
    console.log("in uploadPhoto");
    console.log('respondingToImageName:', respondingToImageName)
    console.log('respondingToImageUrl:', respondingToImageUrl)

    try {
      let filename = new Date().getTime();
      const refName = "images/" + String(filename);
      const ref = storage().ref(refName);

      const metadata = {
        customMetadata: {
          fromUid: userUid,
          toUid: recipient,
          respondingToImageName: respondingToImageName,
          respondingToImageUrl: respondingToImageUrl
        },
      };
      console.log("uri:", uri);
      const res = await ref.putFile(uri, metadata);

      resolve(res);
    } catch (error) {
      console.log("error:", error);
      reject(error);
    }
  });
}

export default function ReviewPhoto(): React.JSX.Element {
  const [loading, setLoading] = useState<boolean>(false);
  const {
    user,
    userData,
    capturedImageUri,
    setPage,
    respondingTo,
    setRespondingTo,
  } = useContainerContext();

  async function sendPhoto() {
    setLoading(true);
    console.log("sending photo");
    let inboxImageName = respondingTo ? Object.keys(userData.inbox)[0] : ''
    let inboxImageUrl = respondingTo ? userData.inbox[Object.keys(userData.inbox)[0]].url : ''
    // "as StorageData" is a type assertion
    const storageData = await uploadPhoto(
      capturedImageUri,
      user.user.uid,
      respondingTo,
      inboxImageName,
      inboxImageUrl
    );
    console.log("storageData:", storageData);


    if (respondingTo) {
      // delete from database
      const { uid } = user.user;
      const toBeDeleted = Object.keys(userData.inbox)[0];
      console.log('uid:', uid)
      console.log('toBeDeleted:', toBeDeleted)
      await database().ref(`userData/${uid}/inbox/${toBeDeleted}`).remove();  
    }



    setRespondingTo(null);
    setLoading(false);
    setPage("CameraPage");
  }

  return (
    <ImageBackground
      source={{ uri: capturedImageUri }}
      style={styles.background}
    >
      <View style={styles.bottomButtons}>
        {respondingTo ? (
          <Image
            source={{
              uri: userData.inbox[Object.keys(userData.inbox)[0]].url,
            }}
            style={styles.image}
          />
        ) : null}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => setPage("CameraPage")}
        >
          <FontAwesome6 name="xmark" size={34} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendPhoto} style={styles.sendButton}>
          {loading ? (
            <ActivityIndicator size={"large"} color="black" />
          ) : (
            <MaterialCommunityIcons name="send" size={34} color="black" />
          )}
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  bottomButtons: {
    flex: 0.5,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    // width: '100%',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  image: {
    borderRadius: 5,
    height: 210,
    width: 120,
    position: "absolute",
    left: 0,
    bottom: 0,
  },
  cancelButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.orange,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: Colors.blue,
    justifyContent: "center",
    alignItems: "center",
  },
});
