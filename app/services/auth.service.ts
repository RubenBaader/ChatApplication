import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserCredentials {
    avatarUrl? : string;
    email: string;
    id: string;
    name: string;
    token: string;
}

