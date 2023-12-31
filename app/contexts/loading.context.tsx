import React, { createContext, useContext, useEffect, useState } from "react";

interface LoadingContextProps {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
}

const AppLoadingContext = createContext<LoadingContextProps>({
    isLoading: true,
    setIsLoading: () => {}
});

export const LoadingContextProvider = ({
    children,
}: React.PropsWithChildren<unknown>) => {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        // set minimum load time
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <AppLoadingContext.Provider
        value={{isLoading, setIsLoading}}>
            {children}
        </AppLoadingContext.Provider>
    )
}

export const useLoadingContext = () => {
    const context = useContext(AppLoadingContext);
    if (context === undefined) {
        throw new Error(
            'useAppCMSContext must be used within a AppCMSProvider',
        );
    }
    return context;
}