"use client"
import HelperCard from "components/helperCard";
import {createContext, useContext, useState } from "react";

  
export const AppConfigContext = createContext<{appUserConfig: any, setAppUserConfig:any} | null>(null);
const AppSettings = {
    helper_card:{
        display:true,
    },
}

type AppConfigContextProviderType = {
    children: React.ReactNode
}

export default function AppConfigContextProvider({children}:AppConfigContextProviderType) {

    const [appUserConfig,setAppUserConfig] = useState(AppSettings);

    return (
        <AppConfigContext.Provider value={{ appUserConfig, setAppUserConfig }}>
            {children}
        </AppConfigContext.Provider>
    );
}

export function useAppConfigContext() {
    const context = useContext(AppConfigContext);
    if (!context) {
      throw new Error("useAppConfigContext must be used within a SessionContextProvider");
    }
    return context;
}




  