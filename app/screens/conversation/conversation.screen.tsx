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
    const { conversationId } = route.params

    const authContext = useAuthContext()
    const [messageDataArr, setMessageDataArr] = useState<MessageProps[]>();

    const app = initializeApp(firebaseConfig);
    const [inputValue, setInputValue] = useState<string>('');
    
    const conversationRef = firebase.firestore().collection("Conversations").doc(conversationId);
    const messageListRef = conversationRef.collection("messages");

    useEffect(() => {
        const sortedMessagesRef = messageListRef
            .orderBy("timeStamp", "asc")
        const limitedMessagesRef = sortedMessagesRef
            .limit(50);
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
            timeStamp: new Date().getTime().toString(),
            messageText: inputValue
        }
        messageListRef.add(msg);

        setInputValue('');
    }

    const openGallery = () => {
        launchImageLibrary({ mediaType: 'photo' }, async (response: ImagePickerResponse) => {
            if (!response.didCancel && response.assets && response.assets.length > 0) {
              const imageUri = response.assets[0].uri!;
  
              const storage = getStorage();
              const storageRef = ref(storage, 'images/' + new Date().getTime());
  
  
              const imageBlob = await fetch(imageUri).then(response => response.blob());
              
              await uploadBytes(storageRef, imageBlob);
      
              const downloadURL = await getDownloadURL(storageRef);
  
              // Save the download URL to Firestore (optional)
              const db = getFirestore();
              const imageDocRef = doc(db, 'Conversations', conversationId, 'messages', new Date().getTime().toString());
              const imgMsg : MessageProps = {
                  userDetails : authContext.userDetails!,
                  timeStamp : new Date().getTime().toString(),
                  messageImage : downloadURL
              }
              await setDoc(imageDocRef, imgMsg);
              
  
            }
          });
    }

    const openCamera = () => {
        launchCamera({ mediaType: 'photo' }, async (response: ImagePickerResponse) => {
          if (!response.didCancel && response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri!;

            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + new Date().getTime());

            const imageBlob = await fetch(imageUri).then(response => response.blob());
            
            await uploadBytes(storageRef, imageBlob);
            console.log("Manged to upload bytes");
    
            const downloadURL = await getDownloadURL(storageRef);
            console.log("download URL set:", downloadURL)

            // Save the download URL to Firestore
            const db = getFirestore();
            console.log("Firestore loaded")
            const imageDocRef = doc(db, 'Conversations', conversationId, 'messages', new Date().getTime().toString());

            const imgMsg : MessageProps = {
                userDetails : authContext.userDetails!,
                timeStamp : new Date().getTime().toString(),
                messageImage : downloadURL
            }
            console.log("imgMsg populated:", imgMsg);
            // await setDoc(imageDocRef, imgMsg)
            try {
                setDoc(imageDocRef, imgMsg)
            }
            catch {
                console.log("could not write doc");
            }
          }
        });
      };

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