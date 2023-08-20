import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import { UserI } from "../schemes/user.scheme";

export interface MessageProps {
    userDetails : UserI;
    timeStamp : string;
    messageText? : string;
    messageImage? : string;
}

export const Message: React.FC<MessageProps> = props => {
    const senderImg = props.userDetails.photo ? {uri: props.userDetails.photo} : require("../assets/img/placerholder_avatar.png")
    const cast = Number(props.timeStamp);
    const date = new Date(cast).toDateString()

    return (
        <View>
            <Image 
                source={senderImg}
                style={style.image}
            />
            <Text>{props.userDetails.givenName ?? props.userDetails.email} at {date}</Text>
            <Text>{props.messageText}</Text>
            {props.messageImage && <Image source={{uri: props.messageImage}} style={{ maxWidth: 100, height: 100 }} />}
        </View>
    )
}

const style = StyleSheet.create({
    image : {
        height: 40,
        width:  40
    }
})