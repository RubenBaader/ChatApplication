import React from "react"
import { Image, Text } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';

/** 
 * REMEMBER TO ADD CORRECT TYPING
 */
export const SplashScreen : React.FC<any> = () => {
    return (
        <SafeAreaView>
            <Text>Chat Application</Text>
            <Image 
                source={require('../../assets/img/Splash400x400.png')}
            />
            <Text>App is loading...</Text>
        </SafeAreaView>
    )
}