import { SafeAreaView } from "react-native-safe-area-context"
import { StyleSheet, Text } from "react-native"
import { useAuthContext } from "../../contexts/auth.context"
import { UserI } from "../../schemes/user.scheme";
import { Conversation } from "../../components/conversation";
import { MessageProps } from "../../components/message";
import { firebase } from "@react-native-firebase/firestore";
import { FlatList } from "react-native-gesture-handler";
import { Button } from "../../components/button";
import { useEffect, useState } from "react";
import { ConversationI } from "../../schemes/conversation.scheme";

/**
 * DB format:
 * 
 * User collection
 *  User Document
 *      Associated conversation IDs
 * 
 * Conversation collection
 *  Conversation document
 *      Message collection
 *      Associated user IDs
 */

export const HomeScreen : React.FC = () => {
    const { userDetails } = useAuthContext();
    const [conversations, setConversations] = useState<ConversationI[]>([]);

    const testUsers : UserI[] = [
            {
                familyName : "Stevens",
                givenName : "Brad",
                email : "stevenBrad@test.com",
                id : "123-steve"
            },
            {
                familyName : "Foxtrot",
                givenName : "Horatio",
                email : "trotfox@test.com",
                id : "42"
            },
        ]
    let testMessages : MessageProps[] = [
        {
            userDetails : testUsers[0],
            timeStamp : "Yesterday",
            messageText : "Hello there!",
        },
        {
            userDetails : testUsers[1],
            timeStamp : "Yesterday",
            messageText : "General Kenobi!",
        },
        {
            userDetails : testUsers[0],
            timeStamp : "Today",
            messageText : "Ok!",
        },
    ]
    const testMessages2 : MessageProps[] = [
        {
            userDetails : testUsers[0],
            timeStamp : "Yesterday",
            messageText : "Hello there 2!",
        },
        {
            userDetails : testUsers[1],
            timeStamp : "Yesterday",
            messageText : "General Kenobi 2!",
        },
        {
            userDetails : testUsers[0],
            timeStamp : "Today",
            messageText : "Ok 2!",
        },
    ]
    const testMessages3 : MessageProps[] = [
        {
            userDetails : testUsers[0],
            timeStamp : "Yesterday",
            messageText : "Hello there 3!",
        },
        {
            userDetails : testUsers[1],
            timeStamp : "Yesterday",
            messageText : "General Kenobi 3!",
        },
        {
            userDetails : testUsers[0],
            timeStamp : "Today",
            messageText : "Ok 3!",
        },
    ]

    let conversationList = [testMessages, testMessages2, testMessages3]

    
    const conversationsRef = firebase.firestore().collection('Conversations');
    // const conversationsRef = firebase.firestore().collection('Conversations').orderBy("ID", "desc");
    useEffect(() => {
        const wait = conversationsRef.count().get()
        // console.log("Number of conversations:", wait)

        const unsubscribe = conversationsRef.onSnapshot(querySnapshot => {
            const updatedConversations : ConversationI[] = [];
            // const updatedConversations : MessageProps[][] = [];
            querySnapshot.forEach(doc => {
                const data = doc.data();
                const conv : ConversationI = {
                    messages : data.messages,
                    id : data.id,
                    latestMessage : data.latestMessage,
                    users : data.users,
                }
                updatedConversations.push(conv);
                // console.log("OnLoad",doc.data())
            });
            setConversations(updatedConversations);
            console.log("Updated Conversations:",updatedConversations)
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // const authContext = useAuthContext()


    async function debugAction() {
        // console.log("Hello debug")
        const email = userDetails?.email;
        // console.log("Email", email)
        const query = conversationsRef.where(`users.rubenbaader@gmail.com`, "==", "true");
        // const query = conversationsRef.where(`users.${email}`, "==", "true");
        console.log("Query:",query);

        query.get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    console.log("Can I query")
                // Here, you can access the individual document data using doc.data()
                console.log('Document data:', doc.data());
                });
            })
            .catch((error) => {
                console.log('Error getting documents:', error);
            });

        console.log("Goodbye Debug")
        /* const conversationsRef = firebase.firestore().collection('conversations');

        const unsubscribe = conversationsRef.onSnapshot(querySnapshot => {
            const updatedConversations : MessageProps[][] = [];
            querySnapshot.forEach(doc => {
                // updatedConversations.push({ id: doc.id, ...doc.data() });
                console.log(doc.data())
            });
            setConversations(updatedConversations);
        });
        console.log("Debugging:")
        unsubscribe(); */

        // read from db
        /* const conversationsRef = await firebase.firestore().collection("Conversations").doc("conv1").collection("messages").get();

        let l: MessageProps[] = []

        conversationsRef.forEach((x) => {
            // console.log(x.data())
            const data = x.data();
            const A : MessageProps = {
                messageText : data.messageText,
                timeStamp : data.timeStamp,
                userDetails : data.userDetails
            }

            console.log(data.messageText, data.timeStamp)
            // testMessages.push(A)
            conversationList[1].push(A);
            // console.log(conversationList[0].length)
            // l.push(A);
            // console.log(l)
            // console.log(data.get()?.toLocaleString())
            // l.push(data.get()?.toLocaleString())
        }) */
    }

    return (
        <SafeAreaView>
            <Text>Hello, {userDetails?.givenName}!</Text>

            <FlatList 
                // data={conversationList}
                data={conversations}
                renderItem={({ item, index }) => 
                <Conversation 
                    messages={item.messages!}
                    // messageDataArr={item.messages!}
                    latestMessage={item.latestMessage!}
                    id={item.id}
                    // index={index}
                />}
                keyExtractor={(item, index) => index.toString()}
            />

            <Button 
                style={ styles.buttonDefault }
                title="DEBUG ME PLS"
                onPress={() => debugAction()}
            />

            {/* <Button 
                style={ styles.buttonDefault }
                title="New Conversation"
                onPress={() => {
                    // get information about conversation title

                    // get conversation participants

                    // check if entry exsits in db

                    // sync to db and add to member
                }
                }
            /> */}

            {/* <Conversation 
                messageDataArr={testMessages}
            /> */}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    inputField: {
        borderWidth: 1,
        borderColor: "gray",
        padding: 8,
        borderRadius: 5,
        marginTop: 8,
        fontSize: 16,
        // color: "pink",
    },
    buttonDefault: {
        marginTop: 15,
        backgroundColor: "purple",
        // color: "black",
    }
})