import React from "react";
import { Text, View, StyleProp, ViewStyle, Image, StyleSheet } from "react-native";
import { UserI } from "../schemes/user.scheme";

export interface MessageProps {
    userDetails : UserI;
    timeStamp : string;
    messageText : string;
    messageImage? : string;
}

export const Message: React.FC<MessageProps> = props => {
    // const img = "../assets/img/placerholder_avatar.png"
    // const img = props.userDetails.photo ?? "app/assets/img/placerholder_avatar.png"
    const senderImg = props.userDetails.photo ? {uri: props.userDetails.photo} : require("../assets/img/placerholder_avatar.png")
    return (
        <View>
            <Image 
                source={senderImg}
                style={style.image}
            />
            <Text>{props.userDetails.givenName ?? props.userDetails.email} at {props.timeStamp}</Text>
            <Text>{props.messageText}</Text>
            {props.messageImage ? 
            <Image 
                source={{uri: props.messageImage}}
            /> : null}
        </View>
    )
}

const style = StyleSheet.create({
    image : {
        height: 40,
        width:  40
    }

})