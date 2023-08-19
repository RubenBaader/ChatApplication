/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Linking,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { Props, RootNavigator, RootStackParamList } from './navigators';
import { LoadingContextProvider } from './contexts/loading.context';
import { AuthContextProvider, useAuthContext } from './contexts/auth.context';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { navigationRef } from './navigators';


function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  // const navigation = useNavigation<RootStackParamList>();
  // const navigation = useNavigation<any>();
  // navigation.navigate('conversation', { conversationId: 'conv2' });

  const authContext = useAuthContext();

  useEffect(() => {
    // listen for FCM message
    messaging().setBackgroundMessageHandler(onMessageReceived);
      // messaging().onMessage(onMessageReceived);
      // backgroundListen();

      // messaging().setBackgroundMessageHandler(bootstrap)
      

      /* return notifee.onBackgroundEvent(async ({ type, detail }) => {
        console.log("Background Event:", type, detail)
      // return notifee.onForegroundEvent(({ type, detail }) => {
        switch (type) {
          case EventType.DISMISSED:
            console.log('User dismissed notification', detail.notification);
            break;
          case EventType.PRESS:
            console.log('User pressed notification', detail.notification);
            break;
        }
      }); */


      bootstrap()
      // .then(x => console.log("bootstrap"))
      .catch(console.error);
      
    },[])
    
  
  const [screenProps, setScreenProps] = useState<string | null >(null);
  async function bootstrap() {
    // console.log("before await")
    const initialNotification = await notifee.getInitialNotification();

    console.log("Hell from bootstrap");

    if (initialNotification) {
      console.log('Notification caused application to open', initialNotification.notification);
      console.log('Press action used to open the app', initialNotification.pressAction);
      navToConv("conv2");
    }
  }

  
  const navToConv = (input : string) => {
    // set usercontext to something
    authContext.setUserDetails({
      email : "test@test.com",
      id : "1234"
    })
    // pass notification data to some props?
    // setScreenProps(conversationId)

    if(navigationRef.isReady())
      navigationRef.navigate('conversation', {conversationId : "conv2"})
    else
      console.log("NavigationRef not ready yet")
    // RootNav takes id as optional prop
    // consume props to navigate from rootnavigator or home screen

  }

  async function onMessageReceived(message : any) {
    console.log('onMessageReceived Received a message!');

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
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            pressAction: {
                id: 'conv2',
                launchActivity: "default"
            },
        },
    });
  }

  /* async function backgroundListen() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      const { notification, pressAction } = detail;

      if (type === EventType.PRESS) {
          // navigation.navigate('conversation', { conversationId: 'conv2' });
          console.log("Hello notifications")

          if(notification!.id != undefined)
            await notifee.cancelNotification(notification!.id);
      }
    });
  } */

  

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };



  return (
    
    <SafeAreaProvider>
        <LoadingContextProvider>
          <AuthContextProvider>

            <RootNavigator 
              destination={screenProps}
            />
      
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
