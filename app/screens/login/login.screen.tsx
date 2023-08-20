import React, { useState } from "react"
import { Alert, SafeAreaView, StyleSheet, Text, TextInput } from "react-native"
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
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
  
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

    
    async function onFacebookButtonPress() {
      console.log("Current user:", firebase.auth().currentUser)
      // Attempt login with permissions
      
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
      console.log("RESULT:" ,result);

      if (result.isCancelled) {
        throw 'User cancelled the login process';
      }

      // Once signed in, get the users AccessToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);
      console.log("facebook credential:", facebookCredential)

      // Sign-in the user with the credential (or try)
      try {
        await auth().signInWithCredential(facebookCredential);

        // TODO: update authCredentials with login credentials
        //      get fcm token
        //      add user to firestore
      }
      catch (error : any) {
        if (error.code === 'auth/account-exists-with-different-credential') {
          Alert.alert("⚠️ This user exists in a different authentication")
          // Handle the account linking process
          
        } else {
          // Handle other errors
          console.log("Failed to log in.", error.code)
        }
      }
      return
    }

    async function onGoogleButtonPress() {
        // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

        // Get the users ID token
        const data = await GoogleSignin.signIn();

        // Get FCM token
        const fcm = await getFCMToken();
        
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

        // Sign-in the user with the credential
        // return auth().signInWithCredential(googleCredential);

        try {
          await auth().signInWithCredential(googleCredential);
  
          // TODO: update authCredentials with login credentials
          //      get fcm token
          //      add user to firestore
        }
        catch (error : any) {
          if (error.code === 'auth/account-exists-with-different-credential') {
            Alert.alert("⚠️ This user exists in a different authentication")
            // Handle the account linking process
            
          } else {
            // Handle other errors
            console.log("Failed to log in.", error.code)
          }
        }
        return;
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
            <Button
                style={ styles.buttonDefault }
                isLoading={false}
                title="Facebook"
                onPress={() => onFacebookButtonPress()}
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
        backgroundColor: "blue",
        // color: "black",
    }
})