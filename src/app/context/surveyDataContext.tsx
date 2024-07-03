// /app/context/usersContext.tsx
"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";


type surveyData = any | null
interface SurveyDataProviderProps {
  children: ReactNode;
  surveyData:surveyData
}
type SurveyData = {
  ownerSurveyData: any[];
  clientSurveyData: any[];
  teamSurveyData: any[];
  summary:any
};

export const SurveyDataContext =  createContext<{data: SurveyData, setData:any} | null>(null);

export default function SurveyDataContextProvider({surveyData, children }: SurveyDataProviderProps) {
  const [data, setData] = useState<surveyData>(surveyData);
  
  return (
    <SurveyDataContext.Provider value={{data,setData}}>
      {children}
    </SurveyDataContext.Provider>
  );
}

export function useSurveyDataContext() {
  const context = useContext(SurveyDataContext);
  if (!context) {
    throw new Error("useSurveyDataContext must be used within a SurveyDataContextProvider");
  }
  return context;
}