import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextProps {
    // isLoading: boolean;
    // setIsLoading: (isLoading: boolean) => void;
}

const AuthContext = createContext<AuthContextProps>({
    // isLoading: true,
    // // isLoading: false,
    // setIsLoading: () => {}
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