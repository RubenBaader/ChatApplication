import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Image, Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Message, MessageProps } from "./message";
import { Button } from "./button";
import { firebase } from "@react-native-firebase/firestore";
import { useAuthContext } from "../contexts/auth.context";
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationI } from "../schemes/conversation.scheme";
import notifee from '@notifee/react-native';
import { useNavigation } from "@react-navigation/native";

export interface ConvoProps {
    messageDataArr : MessageProps[];
    latestMessage : MessageProps;
    index : Number;
    id : string;
}

interface PreviewProps extends ConversationI {
    onPress : Function
}

export const ConvPreview : React.FC<PreviewProps> = props => {
    const { id, latestMessage, onPress } = props

    return(
        <Pressable
            style={styles.conversation}
            onPress={() => onPress()}
            >
            <Message
                userDetails={latestMessage.userDetails}
                timeStamp={latestMessage.timeStamp}
                messageText={latestMessage.messageText}
            />
            <Image source={require('../assets/img/chatChevron.png')} style={styles.chevron} />
        </Pressable>
    )
}


const styles = StyleSheet.create({
    conversation : {
        borderColor : 'red',
        borderWidth: 2,
        margin : 10,
        display: "flex",
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
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
    chevron: {
        height: 50,
        width: 30,
    }

})