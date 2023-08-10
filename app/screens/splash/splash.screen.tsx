import React from "react"
import { Image, Text } from "react-native"
import { SafeAreaView } from 'react-native-safe-area-context';

/** 
 * TODO: Add typing to screen components
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