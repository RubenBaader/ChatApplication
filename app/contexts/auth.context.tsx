import React, { createContext, useContext, useEffect, useState } from "react";

/**
 * I want in my auth context provider
 * Some information on the user.
 * Specifically, I want to know their name,
 * their ID, email, and token.
 * The token is important because
 * it's a unique identifier and gatekeeper
 * for security stuff
 */



interface UserDetails {
    name: string,
    email: string,
    id: string,
    token: string,
    avatar?: string,

    // isLoading: boolean;
    // setIsLoading: (isLoading: boolean) => void;
}

type AuthStateType = {
    userDetails: UserDetails | null;
}

const initialState : AuthStateType = {
    userDetails : null
}

interface AuthContextI extends AuthStateType {
    setDetails: (userDetails : UserDetails | null) => void;
    clearDetails: () => void;
}

const AuthContext = createContext<AuthContextI>({
    ...initialState,
    setDetails: () => null,
    clearDetails: () => null,
});

export const AuthContextProvider = ({
    children,
}: React.PropsWithChildren<unknown>) => {
    // const [isLoading, setIsLoading] = useState(true);
    // console.log("I am a context provider")
    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //         setIsLoading(false);
    //         console.log("Stopped loading ###################################")
    //     }, 1500);

    //     return () => clearTimeout(timer);
    // }, []);

    // return (
    //     <AppLoadingContext.Provider
    //     value={{isLoading, setIsLoading}}>
    //         {children}
    //     </AppLoadingContext.Provider>
    // )
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error(
            'useAppCMSContext must be used within a AppCMSProvider',
        );
    }
    // console.log("Just providing some context")
    return context;
}