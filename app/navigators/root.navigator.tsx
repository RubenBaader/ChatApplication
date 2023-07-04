import {
    createNavigationContainerRef,
    NavigationContainer,
} from '@react-navigation/native';
import {
    createStackNavigator,
    StackCardInterpolationProps,
} from '@react-navigation/stack';
import { useState } from 'react';
import { SplashScreen } from '../screens/splash';
import { LoginScreen } from '../screens/login';

const [loading, setLoading] = useState(false);
const stack = createStackNavigator();

export const RootNavigator = () => {
    return (
       <NavigationContainer>
            {loading ? (
                <stack.Navigator>
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