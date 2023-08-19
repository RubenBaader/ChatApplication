import {
    createNavigationContainerRef,
    NavigationContainer,
} from '@react-navigation/native';
import {
    createStackNavigator,
    StackCardInterpolationProps,
} from '@react-navigation/stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Fragment, useContext, useEffect, useState } from 'react';
import { SplashScreen } from '../screens/splash';
import { LoginScreen } from '../screens/login';
import { LoadingContextProvider, useLoadingContext } from '../contexts/loading.context';
import { HomeScreen } from '../screens/home';
import { useAuthContext } from '../contexts/auth.context';
import { firebase } from '@react-native-firebase/auth';
import { ConversationScreen } from '../screens/conversation'; 


// const [loading, setLoading] = useState(true);
export type RootStackParamList = {
    splash : undefined,
    login : undefined,
    home : undefined,
    conversation : { conversationId : string },
}

export type Props = NativeStackScreenProps<RootStackParamList, 'conversation', 'conversationId'>;
export type Home = NativeStackScreenProps<RootStackParamList, 'home'>;
const stack = createStackNavigator<RootStackParamList>();

interface NavigationProps {
    destination : string | null,
}
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export const RootNavigator : React.FC<NavigationProps> = (props) => {

    const { destination } = props;
    console.log("RootNav Props:",props);
    const appLoadingContext = useLoadingContext();
    const authContext = useAuthContext();

    if(destination) {
        console.log("Rootnavigator reporting! Destination;", destination);
    }

    return (
        <NavigationContainer ref={navigationRef}>
            {appLoadingContext.isLoading ? (
                <stack.Navigator
                screenOptions={{
                    presentation: 'card',
                    headerShown: false,
                }}>
                    <stack.Screen name='splash' component={SplashScreen}/>
                </stack.Navigator>
            ) : (
                <stack.Navigator
                screenOptions={{
                    presentation: 'card',
                    headerShown: false,
                }}>
                    {!authContext.userDetails ? (
                        <stack.Screen name='login' component={LoginScreen} /> 
                    ) : (
                        <stack.Group>
                            <stack.Screen name='home' component={HomeScreen} />
                            <stack.Screen name='conversation' component={ConversationScreen}/>

                        </stack.Group>
                        )
                    }
                </stack.Navigator>
            )}
        </NavigationContainer>
    );
}
