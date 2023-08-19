/**
 * Interface for the User type.
 * 
 * App user should be populated on log in: \
 *  From Auth - name, email, photo, id \
 *  From DB - contacts and associated conversations to load on the home screen
 */

export interface UserI {
    familyName?: string;
    givenName?: string;
    email: string;
    photo?: string;
    id: string;
    conversationIds? : string[];
    friendIds? : string[];
}

export interface FirestoreUserI extends UserI {
    firestoreToken? : string;
}