import React from "react"
import { Text } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';

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