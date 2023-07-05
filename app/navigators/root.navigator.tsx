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

// const [loading, setLoading] = useState(true);
const stack = createStackNavigator();

export const RootNavigator = () => {
    const appLoadingContext = useLoadingContext();

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
                <stack.Navigator>
                    <stack.Screen name='login' component={LoginScreen} />
                </stack.Navigator>
            )}
        </NavigationContainer>
    );
}