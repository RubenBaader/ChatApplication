import { createNavigationContainerRef, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { SplashScreen } from '../screens/splash';
import { LoginScreen } from '../screens/login';
import {  useLoadingContext } from '../contexts/loading.context';
import { HomeScreen } from '../screens/home';
import { useAuthContext } from '../contexts/auth.context';
import { ConversationScreen } from '../screens/conversation'; 

export type RootStackParamList = {
    splash : undefined,
    login : undefined,
    home : undefined,
    conversation : { conversationId : string },
}

export type Props = NativeStackScreenProps<RootStackParamList, 'conversation', 'conversationId'>;
export type Home = NativeStackScreenProps<RootStackParamList, 'home'>;
const stack = createStackNavigator<RootStackParamList>();

export const navigationRef = createNavigationContainerRef<RootStackParamList>();
export const RootNavigator : React.FC = () => {

    const appLoadingContext = useLoadingContext();
    const authContext = useAuthContext();

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
