/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */


import React, { useEffect, useState } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { RootNavigator } from './navigators';
import { LoadingContextProvider } from './contexts/loading.context';
import { AuthContextProvider, useAuthContext } from './contexts/auth.context';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    // listen for FCM message
    messaging().setBackgroundMessageHandler(onMessageReceived);
    },[])
    

  async function onMessageReceived(message : any) {
    /* if(os.type == iOs)
        await notifee.requestPermission(); */

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    await notifee.displayNotification({
        title: message.notification.title,
        body: message.notification.body,
        android: {
            channelId,
            pressAction: {
                id: 'conv2',
                launchActivity: "default"
            },
        },
    });
  }


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };



  return (
    
    <SafeAreaProvider>
        <LoadingContextProvider>
          <AuthContextProvider>

            <RootNavigator />
      
          </AuthContextProvider>
        </LoadingContextProvider>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
