import React from "react"
import { SafeAreaView, Text, TextInput } from "react-native"

/** 
 * REMEMBER TO ADD CORRECT TYPING
 */
export const LoginScreen : React.FC<any> = () => {
    return (
        <SafeAreaView>
            <Text>Welcome to the LOGIN screen</Text>
            <TextInput 
                value="HELLO THERE"
            />
            <TextInput 
                value="HELLO THERE"
            />
        </SafeAreaView>
    )
}