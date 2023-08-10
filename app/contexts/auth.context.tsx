import React, { createContext, useContext, useState } from "react";
import { User } from "../globalTypes/user";

type AuthStateType = {
    userDetails: User | null;
}

interface AuthContextI extends AuthStateType {
    setUserDetails: (userDetails : User | null) => void;
    clearDetails : Function;
}

const AuthContext = createContext<AuthContextI>({
    userDetails : null,
    setUserDetails: () => {},
    clearDetails: () => {},
});

export const AuthContextProvider = ({
    children,
}: React.PropsWithChildren<unknown>) => {
    const [userData, setUserData] = useState<User | null>(null);
    const clearDetails = () => setUserData(null);
    
    return (
        <AuthContext.Provider
        value={{
            userDetails : userData, 
            setUserDetails : setUserData,
            clearDetails,
            }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            'useAuthContext must be used within an AuthContextProvider',
        );
    }
    // console.log("Just providing some context")
    return context;
}