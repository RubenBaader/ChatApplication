import React from "react"
import { SafeAreaView, StyleSheet, Text, TextInput } from "react-native"
import { Button } from "../../components/button"

/** 
 * REMEMBER TO ADD CORRECT TYPING
 */
export const LoginScreen : React.FC<any> = () => {
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
        // fontFamily: "roboto",
        color: "black",
    }
})