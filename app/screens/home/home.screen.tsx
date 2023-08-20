import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, Text } from "react-native"
import { useAuthContext } from "../../contexts/auth.context"
import { ConvPreview } from "../../components/preview";
import { firebase } from "@react-native-firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { ConversationI } from "../../schemes/conversation.scheme";
import { PermissionsAndroid } from "react-native";
import { Home } from "../../navigators";


/**
 * DB format:
 * 
 * User collection
 *  User Document
 *      Associated conversation IDs
 * 
 * Conversation collection
 *  Conversation document
 *      Message collection
 *      Associated user IDs
 **/

export const HomeScreen : React.FC<Home> = ({ navigation } : Home) => {
    const { userDetails } = useAuthContext();
    const [conversations, setConversations] = useState<ConversationI[]>([]);

    // If OS.system == Android:
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    // Else handle iOS
    // ...

    const conversationsRef = firebase.firestore().collection('Conversations');
    const sortedRef = conversationsRef.orderBy("latestMessage.timeStamp", "desc");
    useEffect(() => {

        const unsubscribe = sortedRef.onSnapshot(querySnapshot => {
            
            // Listen for updates in conversations
            const updatedConversations : ConversationI[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const conv : ConversationI = {
                    messages      : data.messages,
                    id            : data.id,
                    latestMessage : data.latestMessage,
                    users         : data.users,
                }
                updatedConversations.push(conv);
            });
            setConversations(updatedConversations);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    const openConv = (id : string) => {
        navigation.navigate('conversation', {conversationId: id})
    }

    return (
        <SafeAreaView>
            <Text>Hello, {userDetails?.givenName}!</Text>

            <FlatList 
                data={conversations}
                renderItem={({ item, index }) => 
                <ConvPreview 
                    messages={item.messages!}
                    latestMessage={item.latestMessage!}
                    id={item.id}
                    onPress={() => {
                        openConv(item.id)
                    }}
                />}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputField: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
        fontSize: 16,
    },
    buttonDefault: {
        marginTop: 15,
        backgroundColor: "purple",
    }
})