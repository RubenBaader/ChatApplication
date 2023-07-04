import React from "react"
import { SafeAreaView, Text } from "react-native/types"

/** 
 * REMEMBER TO ADD CORRECT TYPING
 */
export const SplashScreen : React.FC<any> = () => {
    return (
        <SafeAreaView>
            <Text>Hello there, I am a splash screen!</Text>
        </SafeAreaView>
    )
}