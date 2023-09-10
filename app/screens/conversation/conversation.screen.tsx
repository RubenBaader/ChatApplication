import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Modal, StyleSheet, TextInput } from "react-native";
import { Message, MessageProps } from "../../components"; 
import { Button } from "../../components"; 
import { firebase } from "@react-native-firebase/firestore";
import { useAuthContext } from "../../contexts/auth.context"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { Props } from "../../navigators";
import {launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../config/firebaseConfig";



export const ConversationScreen : React.FC<Props> = ( {route, navigation} : Props ) => {
    const app = initializeApp(firebaseConfig);

    // Component's own ID to bind to database
    const { conversationId } = route.params

    // Pulls user details from login info to send with message
    const authContext = useAuthContext()

    // All messages taken from the database
    const [messageDataArr, setMessageDataArr] = useState<MessageProps[]>();

    // text storage for writing your message
    const [inputValue, setInputValue] = useState<string>('');
    
    // create reference to collection in firebase
    const conversationRef = firebase.firestore().collection("Conversations").doc(conversationId);
    const messageListRef = conversationRef.collection("messages");

    useEffect(() => {
        // sort messages by timestamp
        const sortedMessagesRef = messageListRef
            .orderBy("timeStamp", "asc")
        // limit number of messages to get
        const limitedMessagesRef = sortedMessagesRef
            .limit(50);

        // TODO: update query so limiting number of messages does not affect display order

        // set up listener to register changes in the database's messages
        const unsubscribe = sortedMessagesRef.onSnapshot(querySnapshot => {
        // const unsubscribe = limitedMessagesRef.onSnapshot(querySnapshot => {

            const list: MessageProps[] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const msg : MessageProps = {
                    messageText : data.messageText ?? "",
                    timeStamp   : data.timeStamp,
                    userDetails : data.userDetails,
                    messageImage : data.messageImage ?? "",
                }
                list.push(msg);
            });

            // add updated messages to state
            setMessageDataArr(list);
            // update conversation document to reflext latest message
            conversationRef.set(
                { "latestMessage" : list[list.length -1] },
                { merge : true }
            )
        })

        // remove listener when component is unmounted
        return () => { unsubscribe() }
    }, [])

    // sync value of input field with state
    const handleInputChange = (text: string) => {
        setInputValue(text);
    };

    // use navigation.navigate('home') rather than navigation.pop() since user may land on this screen from deep links
    const backToHome = () => {
        navigation.navigate('home');
    }

    const sendMessage = async () => {
        // don't send empty messages
        if(!inputValue)
            return;
        // populate msg data, then push to db
        const msg: MessageProps = {
            userDetails : authContext.userDetails!,
            timeStamp   : new Date().getTime().toString(),
            messageText : inputValue
        }
        messageListRef.add(msg);

        // reset input field for next msg
        setInputValue('');
    }

    const openGallery = () => {
        launchImageLibrary(
            { mediaType: 'photo' }, 
            async (response: ImagePickerResponse) => { 
                handleResponseAsset(response); 
            });
    }

    const openCamera = () => {
        launchCamera(
            { mediaType: 'photo' }, 
            async (response: ImagePickerResponse) => {
            handleResponseAsset(response);
        });
    }

    // Handle response Asset from camera / gallery
    const handleResponseAsset = async (response : ImagePickerResponse) => {
        // Check if response exists
        if (!response.didCancel && response.assets && response.assets.length > 0)
        {
            const imageUri = response.assets[0].uri!;

            // connect to firebase file storage
            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + new Date().getTime());

            // get image data
            const imageBlob = await fetch(imageUri).then(response => response.blob());
            
            // upload data to storage
            await uploadBytes(storageRef, imageBlob);
    
            // get public facing url
            const downloadURL = await getDownloadURL(storageRef);

            // connect to conversation in firestore
            const db = getFirestore();
            const imageDocRef = doc(db, 'Conversations', conversationId, 'messages', new Date().getTime().toString());

            // populate firestore doc with img data
            const imgMsg : MessageProps = {
                userDetails : authContext.userDetails!,
                timeStamp   : new Date().getTime().toString(),
                messageImage : downloadURL
            }

            // save to collection
            try {
                setDoc(imageDocRef, imgMsg)
            }
            catch {
                console.log("could not write doc");
            }
          }
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
                            messageImage={item.messageImage}
                        />
                    }
                />
                <TextInput
                    style={styles.inputField}
                    value={inputValue}
                    onChangeText={handleInputChange}
                    onSubmitEditing={sendMessage}
                />
                <Button
                    style={styles.chatButton}
                    title="Send"
                    onPress={() => sendMessage()}
                />
                <Button
                    style={styles.chatButton}
                    title="View Gallery 📸"
                    onPress={() => openGallery()}
                />
                <Button
                    style={styles.chatButton}
                    title="Open Camera 📸"
                    onPress={() => openCamera()}
                />

                <Button
                    style={styles.chatButton}
                    title="←"
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
    chatButton: {
        marginTop: 5,
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