/**
 * Interface for the User type.
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