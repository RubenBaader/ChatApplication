import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Message, MessageProps } from "../../components"; 
import { Button } from "../../components"; 
import { firebase } from "@react-native-firebase/firestore";
import { useAuthContext } from "../../contexts/auth.context"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationI } from "../../schemes/conversation.scheme"; 
import notifee from '@notifee/react-native';
import { RouteProp, useRoute } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { Props, RootStackParamList } from "../../navigators";

// type ConversationProps = StackScreenProps<RootStackParamList, 'conversation'>
// type ConversationProps = RouteProp<RootStackParamList, 'conversation'>

export const ConversationScreen : React.FC<Props> = ( {route, navigation} : Props ) => {
    const { conversationId } = route.params
    // const { id, messages, latestMessage } = props
    // const route = useRoute();
    // const { id } = route.params;

    const authContext = useAuthContext()
    const [messageDataArr, setMessageDataArr] = useState<MessageProps[]>();
    // const [messageDataArr, setMessageDataArr] = useState(messages);

    // const [show, setShow] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    
    const conversationRef = firebase.firestore().collection("Conversations").doc(conversationId);
    const messageListRef = conversationRef.collection("messages");

    useEffect(() => {
        const sortedMessagesRef = messageListRef.orderBy("timeStamp", "asc");
        const unsubscribe = sortedMessagesRef.onSnapshot(querySnapshot => {

            const list: MessageProps[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const msg : MessageProps = {
                    messageText : data.messageText,
                    timeStamp   : data.timeStamp,
                    userDetails : data.userDetails
                }
                list.push(msg);
            });

            // createNotification();

            setMessageDataArr(list);
            conversationRef.set(
                { "latestMessage" : list[list.length -1] },
                { merge : true }
            )
        })

        return () => { unsubscribe() }
    }, [])

    const handleInputChange = (text: string) => {
        setInputValue(text);
    };

    const backToHome = () => {
        navigation.navigate('home');
    }

    const sendMessage = async () => {
        if(!inputValue)
            return;
        const msg: MessageProps = {
            userDetails : authContext.userDetails!,
            timeStamp: new Date().toUTCString(),
            messageText: inputValue
        }

        // setMessageDataArr(...messageDataArr, msg)
        messageListRef.add(msg);

        setInputValue('');
    }

    return (
        <SafeAreaView>
            <Modal
                visible={true}
            >
                <FlatList
                    data={messageDataArr}
                    renderItem={
                        ( {item} : {item : MessageProps} ) => 
                        <Message
                            userDetails={item.userDetails}
                            timeStamp={item.timeStamp}
                            messageText={item.messageText}
                        />
                    }
                />
                <TextInput
                    style={styles.inputField}
                    value={inputValue}
                    onChangeText={handleInputChange}
                />
                <Button
                    style={styles.buttonDefault}
                    title="Send"
                    onPress={() => sendMessage()}
                />
                <Button
                    style={styles.buttonDefault}
                    title="Back"
                    onPress={() => backToHome() }
                />
            </Modal>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    conversation : {
        borderColor : 'red',
        borderWidth: 2,
        margin : 10,
    },
    buttonDefault: {
        marginTop: 15,
        backgroundColor: "purple",
        // color: "black",
    },
    inputField: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
        fontSize: 16,
        // color: "pink",
    },

})