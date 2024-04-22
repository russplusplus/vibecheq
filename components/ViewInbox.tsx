import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Platform,
  TextInput,
  ActivityIndicator,
  ImageBackground,
  Image
} from "react-native";
import database from "@react-native-firebase/database";
import storage from "@react-native-firebase/storage";

import LoadingModal from "./LoadingModal";

import { useContainerContext } from "./ContainerContext";

export default function ViewInbox() {
  const [loading, setLoading] = useState<boolean>(false);
  const { user, setPage, respondingTo, setRespondingTo, userData } = useContainerContext();

  async function handlePressAnywhere() {
    console.log("in handlePressAnywhere");
    // don't delete from database or storage yet if the user will be responding,
    // because we need the first inbox image to show in CameraPage and ReviewPhoto.
    if (!respondingTo) {
      // delete from database
      const { uid } = user.user;
      const inboxImageName = Object.keys(userData.data.inbox)[0];
      console.log('uid:', uid)
      console.log('inboxImageName:', inboxImageName)
      await database().ref(`users/${uid}/data/inbox/${inboxImageName}`).remove();
      // delete from storage
      const respondingToImageName = userData.data.inbox[inboxImageName].respondingToImageName
      await storage().ref(`images/${inboxImageName}`).delete()
      await storage().ref(`images/${respondingToImageName}`).delete()

    }
    setPage("CameraPage");
  }

  useEffect(() => {
    if (userData.data.inbox[Object.keys(userData.data.inbox)[0]].isResponse) {
      setRespondingTo(null);
    } else {
      setRespondingTo(
        userData.data.inbox[Object.keys(userData.data.inbox)[0]].from
      );
    }
  }, []);

  return (
    <View style={styles.container}>
      <LoadingModal loading={loading} />

      <TouchableWithoutFeedback onPress={handlePressAnywhere}>
        <ImageBackground
          style={styles.background}
          source={{
            uri: userData.data.inbox[Object.keys(userData.data.inbox)[0]].url,
          }}
        >
          {userData.data.inbox[Object.keys(userData.data.inbox)[0]].isResponse ?
            <Image
              source={{ uri: userData.data.inbox[Object.keys(userData.data.inbox)[0]].respondingToImageUrl }}
              style={styles.image}
            />
            :
            null
          }
        </ImageBackground>
      </TouchableWithoutFeedback>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
  },
  background: {
    flex: 1,
  },
  image: {
    borderRadius: 5,
    height: 210,
    width: 120,
    position: 'absolute',
    left: 0,
    bottom: 0,
    marginHorizontal: 16,
    marginBottom: 16,
  },
});
