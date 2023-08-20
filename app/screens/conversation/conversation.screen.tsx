import React, { useEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Modal, Pressable, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Message, MessageProps } from "../../components"; 
import { Button } from "../../components"; 
import { firebase } from "@react-native-firebase/firestore";
import { useAuthContext } from "../../contexts/auth.context"; 
import { SafeAreaView } from "react-native-safe-area-context";
import { ConversationI } from "../../schemes/conversation.scheme"; 
import { StackScreenProps } from "@react-navigation/stack";
import { Props, RootStackParamList } from "../../navigators";
import {launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';
import { getStorage, ref, uploadString, getDownloadURL, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { initializeApp } from "firebase/app";
import firebaseConfig from "../../config/firebaseConfig";
import RNFS from 'react-native-fs'; // Import react-native-fs


// type ConversationProps = StackScreenProps<RootStackParamList, 'conversation'>
// type ConversationProps = RouteProp<RootStackParamList, 'conversation'>

export const ConversationScreen : React.FC<Props> = ( {route, navigation} : Props ) => {
    const { conversationId } = route.params
    // const { id, messages, latestMessage } = props
    // const route = useRoute();
    // const { id } = route.params;

    const authContext = useAuthContext()
    const [messageDataArr, setMessageDataArr] = useState<MessageProps[]>();


    const app = initializeApp(firebaseConfig);
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
            timeStamp: new Date().toUTCString(),
            messageText: inputValue
        }

        // setMessageDataArr(...messageDataArr, msg)
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
              // await uploadString(storageRef, imageUri, 'data_url');
              
              await uploadBytes(storageRef, imageBlob);
              // await uploadString(storageRef, 'data:image/jpeg;base64,' + imageData, 'data_url');
      
              const downloadURL = await getDownloadURL(storageRef);
  
              // setUploadedImageUrl(downloadURL);
  
              // Save the download URL to Firestore (optional)
              const db = getFirestore();
              const imageDocRef = doc(db, 'Conversations', conversationId, 'messages', new Date().getTime().toString());
              // const imageDocRef = doc(db, 'images', new Date().getTime().toString());
              const imgMsg : MessageProps = {
                  userDetails : authContext.userDetails!,
                  timeStamp : new Date().getTime().toString(),
                  messageImage : downloadURL
              }
              // console.log("MESSAGEIMG IN CONVERSATION:", imgMsg.messageImage)
              await setDoc(imageDocRef, imgMsg);
              
  
            }
          });
    }

    // const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const openCamera = () => {
        launchCamera({ mediaType: 'photo' }, async (response: ImagePickerResponse) => {
          if (!response.didCancel && response.assets && response.assets.length > 0) {
            const imageUri = response.assets[0].uri!;

            const storage = getStorage();
            const storageRef = ref(storage, 'images/' + new Date().getTime());


            const imageBlob = await fetch(imageUri).then(response => response.blob());
            // await uploadString(storageRef, imageUri, 'data_url');
            
            await uploadBytes(storageRef, imageBlob);
            // await uploadString(storageRef, 'data:image/jpeg;base64,' + imageData, 'data_url');
    
            const downloadURL = await getDownloadURL(storageRef);

            // setUploadedImageUrl(downloadURL);

            // Save the download URL to Firestore (optional)
            const db = getFirestore();
            const imageDocRef = doc(db, 'Conversations', conversationId, 'messages', new Date().getTime().toString());
            // const imageDocRef = doc(db, 'images', new Date().getTime().toString());
            const imgMsg : MessageProps = {
                userDetails : authContext.userDetails!,
                timeStamp : new Date().getTime().toString(),
                messageImage : downloadURL
            }
            // console.log("MESSAGEIMG IN CONVERSATION:", imgMsg.messageImage)
            await setDoc(imageDocRef, imgMsg);
            

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
                />
                <Button
                    style={styles.buttonDefault}
                    title="Send"
                    onPress={() => sendMessage()}
                />
                <Button
                    style={styles.buttonDefault}
                    title="📸"
                    onPress={() => openGallery()}
                    // onPress={() => openCamera()}
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