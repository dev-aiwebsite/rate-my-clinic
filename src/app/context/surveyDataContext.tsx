// /app/context/usersContext.tsx
"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from "react";


type surveyData = any | null
interface SurveyDataProviderProps {
  children: ReactNode;
  surveyData:surveyData
}
export type SurveyDataType = {
  ownerSurveyData: any;
  clientSurveyData: any[];
  teamSurveyData: any[];
  summary:any;
  other_summary:any;
  overalls:any;
};

export const SurveyDataContext =  createContext<{data: SurveyDataType, setData:any} | null>(null);

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