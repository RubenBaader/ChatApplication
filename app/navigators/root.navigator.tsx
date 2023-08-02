import {
    createNavigationContainerRef,
    NavigationContainer,
} from '@react-navigation/native';
import {
    createStackNavigator,
    StackCardInterpolationProps,
} from '@react-navigation/stack';
import { useContext, useState } from 'react';
import { SplashScreen } from '../screens/splash';
import { LoginScreen } from '../screens/login';
import { LoadingContextProvider, useLoadingContext } from '../contexts/loading.context';
import { HomeScreen } from '../screens/home';

// const [loading, setLoading] = useState(true);
const stack = createStackNavigator();

export const RootNavigator = () => {
    const appLoadingContext = useLoadingContext();
    const [loggedIn, setLoggedIn] = useState(false)

    return (
        <NavigationContainer>
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
                    {!loggedIn ? (
                        <stack.Screen name='login' component={LoginScreen} /> 
                    ) : (
                        <stack.Screen name='home' component={HomeScreen} />
                    )
                }
                </stack.Navigator>
            )}
        </NavigationContainer>
    );
}