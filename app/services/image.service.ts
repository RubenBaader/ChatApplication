import { MessageProps } from "../components"; 
import { launchCamera, launchImageLibrary, ImagePickerResponse} from 'react-native-image-picker';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { UserI } from "../schemes/user.scheme";

/**
 * Select a stored image to send via chat
 */
export const openGallery = (convId : string, user : UserI) => {
    launchImageLibrary(
        { mediaType: 'photo' }, 
        async (response: ImagePickerResponse) => { 
            handleResponseAsset(response, convId, user); 
        });
}
/** 
 * Open the phone's camera and send the resulting image via chat
 **/
export const openCamera = (convId : string, user : UserI) => {
    launchCamera(
        { mediaType: 'photo' }, 
        async (response: ImagePickerResponse) => {
            handleResponseAsset(response, convId, user);
    });
}

/**
 *  Handle response Asset from camera / gallery
 **/
const handleResponseAsset = async (response : ImagePickerResponse, convId : string, user : UserI) => {
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
        const imageDocRef = doc(db, 'Conversations', convId, 'messages', new Date().getTime().toString());

        // populate firestore doc with img data
        const imgMsg : MessageProps = {
            userDetails : user,
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