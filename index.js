/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './app/App';
import { name as appName } from './app.json';
import notifee, { EventType } from '@notifee/react-native';
import { navigationRef } from './app/navigators';
import { decode } from 'base-64';
import { Settings } from 'react-native-fbsdk-next';

Settings.initializeSDK();

if (typeof atob === 'undefined') {
    global.atob = decode;
}

// Handle background events from notifee
notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.PRESS) {
        //use AsnycStorage to stay logged in, then navigate
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

AppRegistry.registerComponent(appName, () => App);
