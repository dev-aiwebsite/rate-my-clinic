"use client"
import {createContext, useContext, useState } from "react";
import { User } from "../../../types/types";

  
export const SessionContext = createContext<{currentUser: any, setCurrentUser:any, users:User[]} | null>(null);


type CurrentUser = any |null
type SessionContextProviderType = {
    children: React.ReactNode;
    current_user: CurrentUser;
    users?: any | null;
};


export default function SessionContextProvider({children,current_user,users}:SessionContextProviderType) {

    const [currentUser,setCurrentUser] = useState<CurrentUser>(current_user)

    return (
        <SessionContext.Provider value={{ currentUser, setCurrentUser, users }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    const context = useContext(SessionContext);
    if (!context) {
      throw new Error("useSessionContext must be used within a SessionContextProvider");
    }
    return context;
}




  