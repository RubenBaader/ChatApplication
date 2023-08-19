import React, { useState } from "react"
import { SafeAreaView, StyleSheet, Text, TextInput } from "react-native"
import { Button } from "../../components/button"
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { useAuthContext } from "../../contexts/auth.context";
import { firebase } from "@react-native-firebase/firestore";
import messaging from '@react-native-firebase/messaging';
import { FirestoreUserI, UserI } from "../../schemes/user.scheme";
  
/** 
 * TODO: Add typing to screen components
 */
export const LoginScreen : React.FC<any> = () => {
    // const { setUserDetails } = useAuthContext();
    const authContext = useAuthContext();

    GoogleSignin.configure({
        // TODO: Store in .env
        webClientId: "423930373314-fd6kmq38prdluvibh9065qt5g1fs67l0.apps.googleusercontent.com"
    });

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get the users ID token
        const data = await GoogleSignin.signIn();

        // Get FCM token
        const fcm = await getFCMToken();
        console.log("fcm token:", fcm);
        
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      
        // Store user data and assign to authContext and firestore
        const googleUser : FirestoreUserI = {
            familyName : data.user.familyName ?? undefined,
            givenName : data.user.givenName ?? undefined,
            id : data.user.id,
            email : data.user.email,
            photo : data.user.photo ?? undefined,
            firestoreToken : fcm,
        }

        authContext.setUserDetails(googleUser);

        // const firebaseUserList = await firebase.firestore().collection("Users")
        await firebase.firestore().collection("Users")
            .where("email", "==", googleUser.email)
            .limit(1)
            .get()
            .then(querySnapshot => {
                if (!querySnapshot.empty) {
                  const documentSnapshot = querySnapshot.docs[0];
                  const documentRef = documentSnapshot.ref;
                  
                  return documentRef.update(googleUser);
                } else {
                  console.log('No matching document found.');
                }
              })
              .then(() => {
                console.log('Document updated successfully.');
              })
              .catch(error => {
                console.error('Error updating document:', error);
              });


            /* .get()).docs;
        if (firebaseUserList.length == 0)
            firebase.firestore().collection("Users").add(googleUser); */
        // else update existing user to match latest/custom info

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
      }

      async function getFCMToken() {
        // Register the device with FCM
        await messaging().registerDeviceForRemoteMessages();
      
        // Get the token
        const token = await messaging().getToken();
      
        // Save the token
        // await postToApi('/users/1234/tokens', { token });
        return token;
      }


    return (
        <SafeAreaView>
            <Text>Welcome to the LOGIN screen</Text>
            <TextInput 
                style={styles.inputField}
                value="HELLO THERE"
            />
            <TextInput 
                style={styles.inputField}
                value="HELLO THERE"
            />
            <Button
                style={ styles.buttonDefault }
                isLoading={false}
                title="Log In"
            />

            <GoogleSigninButton 
                onPress={() => onGoogleButtonPress()}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputField: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
        fontSize: 16,
        // color: "pink",
    },
    buttonDefault: {
        marginTop: 15,
        backgroundColor: "purple",
        // color: "black",
    }
})