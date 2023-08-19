/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { navigationRef } from './app/navigators';

// // listen for FCM message
// messaging().onMessage(onMessageReceived);
// messaging().setBackgroundMessageHandler(backgroundListen);

notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.PRESS) {
        if (navigationRef.isReady())
            navigationRef.navigate('conversation', {
                conversationId: pressAction.id,
            });
        else {
            console.log('NavigationRef not ready yet');
        }

        // Remove the notification
        await notifee.cancelNotification(notification.id);
    }
});

async function backgroundListen() {
    // console.log('Before notifee background event');
}

AppRegistry.registerComponent(appName, () => App);
