import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Message, MessageProps } from "./message";
import { Button } from "./button";
import { firebase } from "@react-native-firebase/firestore";
import { useAuthContext } from "../contexts/auth.context";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationI } from "../schemes/conversation.scheme";


export interface ConvoProps {
    messageDataArr : MessageProps[];
    latestMessage : MessageProps;
    index : Number;
    id : string;
}

export const Conversation : React.FC<ConversationI> = props => {
    // const { messageDataArr } = props; 
    const convId = props.id;
    const authContext = useAuthContext()
    const [messageDataArr, setMessageDataArr] = useState(props.messages);

    const latestMessage = props.latestMessage;

    const [show, setShow] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>('');
    
    const conversationRef = firebase.firestore().collection("Conversations").doc(convId);
    const messageListRef = conversationRef.collection("messages");

    useEffect(() => {
        const sortedMessagesRef = messageListRef.orderBy("timeStamp", "asc");
        const unsubscribe = sortedMessagesRef.onSnapshot(querySnapshot => {

            const list: MessageProps[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const msg : MessageProps = {
                    messageText : data.messageText,
                    timeStamp : data.timeStamp,
                    userDetails : data.userDetails
                }
                list.push(msg);
                // console.log(msg)
            });
            console.log("Last message:" ,list[list.length -1]);
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
            <Pressable
                style={styles.conversation}
                onPress={() => setShow(true)}
                    >
                 <Message
                    userDetails={latestMessage.userDetails}
                    timeStamp={latestMessage.timeStamp}
                    messageText={latestMessage.messageText}
                    // userDetails={messageDataArr[messageDataArr.length -1].userDetails}
                    // timeStamp={messageDataArr[messageDataArr.length -1].timeStamp}
                    // messageText={messageDataArr[messageDataArr.length -1].messageText}
                />
            </Pressable>
            <Modal
                visible={show}
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
                    onPress={() => setShow(false)}
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