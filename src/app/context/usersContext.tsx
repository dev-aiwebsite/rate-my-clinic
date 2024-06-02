// /app/context/usersContext.tsx
"use client";

import { createContext, useContext, ReactNode } from "react";

interface UsersProviderProps {
  users: any[];
  children: ReactNode;
}

const UsersContext = createContext<any[] | null>(null);

export default function UsersContextProvider({ users, children }: UsersProviderProps) {
  return (
    <UsersContext.Provider value={users}>
      {children}
    </UsersContext.Provider>
  );
}

export function useUsersContext() {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsersContext must be used within a UsersContextProvider");
  }
  return context;
}
