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
/*         GoogleSignin.signIn()
            .then(data => {

                console.log("USERDATA::::::::::::::::::::::::::::", data.user);
                // Create a Google credential with the token
                const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);

                authContext.setUserDetails({
                    familyName : data.user.familyName ?? undefined,
                    givenName : data.user.givenName ?? undefined,
                    id : data.user.id,
                    email : data.user.email,
                    photo : data.user.photo ?? undefined,
                });

                // await auth().signInWithCredential(googleCredential);
                auth().signInWithCredential(googleCredential);

                // Sign-in the user with the credential
                return auth().signInWithCredential(googleCredential);
            })
            .then(() => {
                console.log(authContext.userDetails?.givenName);
                firebase.firestore().collection('Users').add(authContext.userDetails!);

            })
            .catch(e => console.log(e)); */


        // Get the users ID token
        const data = await GoogleSignin.signIn();
        console.log("data = ", data)
      
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(data.idToken);
      
        const testJson = {
            familyName : data.user.familyName ?? undefined,
            givenName : data.user.givenName ?? undefined,
            id : data.user.id,
            email : data.user.email,
            photo : data.user.photo ?? undefined,
        }

        authContext.setUserDetails(testJson);

        console.log("testJson = ", testJson);

        const a = (await firebase.firestore().collection("Users").where("email", "==", testJson.email).get()).docs;
        if (a.length == 0)
            firebase.firestore().collection("Users").add(testJson);
        // else update existing user to match latest/custom info

        
        /* authContext.setUserDetails({
            familyName : data.user.familyName ?? undefined,
            givenName : data.user.givenName ?? undefined,
            id : data.user.id,
            email : data.user.email,
            photo : data.user.photo ?? undefined,
        }); */
        
        // console.log("user details = ",authContext.userDetails)

        // Sign-in the user with the credential
        return auth().signInWithCredential(googleCredential);
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
                // style={},
                style={ styles.buttonDefault }
                isLoading={false}
                    // onPress={() => setPwResetModal(true)}
                title="Log In"
            />

            <GoogleSigninButton 
                onPress={() => onGoogleButtonPress()}
                // onPress={() => handleGoogleLogin()}
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