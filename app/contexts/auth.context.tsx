import React, { createContext, useContext, useState } from "react";
import { UserI } from "../schemes/user.scheme";

type AuthStateType = {
    userDetails: UserI | null;
}

interface AuthContextI extends AuthStateType {
    setUserDetails: (userDetails : UserI | null) => void;
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
    const [userData, setUserData] = useState<UserI | null>(null);
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
    return context;
}