import { PrimeReactProvider } from 'primereact/api';
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/themes/lara-light-blue/theme.css";
import 'primeicons/primeicons.css';


const inter = Inter({ subsets: ["latin"] });

import { Poppins } from 'next/font/google';
import { fetchData } from 'lib/data';
import SessionContextProvider from './context/sessionContext';
import { auth } from './auth';
import { ExtendedSession } from '../../typings';
import { getSurveyData } from 'lib/server-actions';
import SurveyDataContext from '@/context/surveyDataContext';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900']
});

export const metadata: Metadata = {
  title: "Rate my clinic",
  description: "rate my clinic",
};



export default async function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  const Users = await fetchData()
  const session = await auth() as unknown as ExtendedSession
  const users = JSON.parse(JSON.stringify(Users))
  let current_user = null
  let current_user_id = null
  if(session){
    current_user = users?.find((i: { _id: any; }) => i._id == session.user_id) || null
    current_user_id = session.user_id
  }
  
  const surveyData = await getSurveyData(current_user_id)

  return (
    <PrimeReactProvider>
    <html lang="en">
      <body className={`${poppins.className}`}>
        <SurveyDataContext surveyData={surveyData}>
           <SessionContextProvider users={users} current_user={current_user}>{children}</SessionContextProvider>    
          </SurveyDataContext>
        </body>
    </html>
    </PrimeReactProvider>
  );
}