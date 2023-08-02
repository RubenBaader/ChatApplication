import React, { useState } from "react"
import { SafeAreaView, StyleSheet, Text, TextInput } from "react-native"
import { Button } from "../../components/button"
import {
    GoogleSignin,
    GoogleSigninButton,
    statusCodes,
  } from '@react-native-google-signin/google-signin';

  
/** 
 * REMEMBER TO ADD CORRECT TYPING
 */
export const LoginScreen : React.FC<any> = () => {
    const [userInfo, setUserInfo] = useState<any>(null);

    GoogleSignin.configure({
        webClientId: '423930373314-fd6kmq38prdluvibh9065qt5g1fs67l0.apps.googleusercontent.com'
    });

    const handleGoogleLogin = async () => {
        try {
            await GoogleSignin.hasPlayServices();
            const data = await GoogleSignin.signIn();
            setUserInfo({ data });
            console.log(data);
            console.log(userInfo);
        } catch (error : any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                // user cancelled the login flow
                console.log("SIGN IN CANCELLED", error);
            } else if (error.code === statusCodes.IN_PROGRESS) {
                // operation (e.g. sign in) is in progress already
                console.log("REQUEST IN PROGRESS", error);
            } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
                // play services not available or outdated
                console.log("PLAY SERVICE NOT AVAILABLE", error);
            } else {
                // some other error happened
                console.log("OTHER ERROR", error);
            }
        }
    };

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
                onPress={() => handleGoogleLogin()}
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