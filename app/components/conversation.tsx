import React, { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Message, MessageProps } from "./message";
import { Button } from "./button";
import { firebase } from "@react-native-firebase/auth";
import { useAuthContext } from "../contexts/auth.context";
import { SafeAreaView } from "react-native-safe-area-context";


interface ConvoProps {
    messageDataArr : MessageProps[];
}

export const Conversation : React.FC<ConvoProps> = props => {
    const { messageDataArr } = props;
    const [show, setShow] = useState<boolean>(false);
    const authContext = useAuthContext()

    const [inputValue, setInputValue] = useState<string>('');

    const handleInputChange = (text: string) => {
        setInputValue(text);
    };

    const sendMessage = () => {
        if(!inputValue)
            return;
        
        const msg: MessageProps = {
            userDetails : authContext.userDetails!,
            timeStamp: new Date().toString(),
            messageText: inputValue
        }

        firebase.firestore().collection("Conversations").doc("conv1").collection("messages").add(msg)

        console.log(inputValue)
        setInputValue('');

    }

    console.log("messageDataArr ==",messageDataArr.length)

    return (
        <SafeAreaView>
            { !show ? 
            <Pressable
                style={styles.conversation}
                onPress={() => setShow(true)}
                    >
                 <Message
                    // userDetails={messageDataArr[0].userDetails}
                    // timeStamp={messageDataArr[0].timeStamp}
                    // messageText={messageDataArr[0].messageText}
                    userDetails={messageDataArr[messageDataArr.length -1].userDetails}
                    timeStamp={messageDataArr[messageDataArr.length -1].timeStamp}
                    messageText={messageDataArr[messageDataArr.length -1].messageText}
                />
            </Pressable>
                :
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
                        title="Dismiss"
                        onPress={() => setShow(false)}
                    />
                </Modal>     
            }
        </SafeAreaView>

        )
    }

        {/* <Pressable
            style={styles.conversation}
            onPress={() => setShow(!show)}
        >
            {!show ? <Message 
                userDetails={messageDataArr[messageDataArr.length -1].userDetails}
                timeStamp={messageDataArr[messageDataArr.length -1].timeStamp}
                messageText={messageDataArr[messageDataArr.length -1].messageText}
            /> 
            :
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
            />}
        </Pressable> */}

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