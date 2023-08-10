import React from "react";
import { Text, View, StyleProp, ViewStyle } from "react-native";
import { User } from "../globalTypes/user";

export interface MessageProps {
    userDetails : User;
    timeStamp : String;
    messageText : String;
    // style? : StyleProp<ViewStyle>;
}

export const Message: React.FC<MessageProps> = props => {

    return (
        <View>
            <Text>{props.userDetails.givenName ?? props.userDetails.email} at {props.timeStamp}</Text>
            <Text>{props.messageText}</Text>
        </View>
    )
}