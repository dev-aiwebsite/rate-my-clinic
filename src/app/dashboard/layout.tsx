"use server"
import Navbar from "@/ui/navbar/navbar"
import Sidebar from "@/ui/sidebar/sidebar"
import { PrimeReactProvider } from "primereact/api";
import { auth } from "@/auth"
import { ExtendedSession } from "../../../typings";
import Image from "next/image";
import { fetchData } from "lib/data";
import SessionContextProvider from "@/context/sessionContext";
import SurveyDataContext from "@/context/surveyDataContext";
import { getSurveyData, RegisterUser } from "lib/server-actions";
import AppConfigContextProvider from "@/context/appSettingsContext";
import { hasPassedMaxDays } from "lib/helperFunctions";
import { SaveReport } from "lib/generateReportData";
import 'primereact/resources/themes/lara-light-blue/theme.css'; 
import { appReportAsSurveyData } from "lib/appReportAsSurveyData";
import { retrieveCheckoutSession } from "@/api/stripe/actions";
import { reportGenDays } from "lib/Const";
import { demoEmail, demoReports, demoSubscription } from "utils/demo";
import Stripe from "stripe";
import { connectToDb } from "lib/utils";
import bcrypt from 'bcrypt'
import { Users as UsersDb } from "lib/models";
import { randomUUID } from 'crypto';

const Layout = async ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {
    
const session = await auth() as unknown as ExtendedSession
const Users = await fetchData()
const c_user = JSON.stringify(Users.find(i => i._id == session.user_id))
let  currentUser = JSON.parse(c_user)
let allUsers = JSON.parse(JSON.stringify(Users))
let surveyData = await getSurveyData(currentUser._id)
let is_ownerSurveyData_complete = surveyData?.ownerSurveyData ? true : false
let lastCheckoutSession
if(currentUser.useremail == demoEmail){
    demoSubscription[0].lastCheckoutSession_data as Stripe.Checkout.Session

} else {
    lastCheckoutSession = await retrieveCheckoutSession(currentUser.last_checkout_session_id)
}
const subscriptionStartDate = new Date((lastCheckoutSession?.created || 0) * 1000);

currentUser['lastCheckoutSession_data'] = lastCheckoutSession
const {hasPassed, remainingDays, maxEndDate} = hasPassedMaxDays(subscriptionStartDate.toISOString(),reportGenDays)
    if(currentUser.useremail == demoEmail){
        currentUser.reports = demoReports
        currentUser = {...currentUser, ...demoSubscription[0]}
    }


    let reportAsSurveyData = appReportAsSurveyData(currentUser,subscriptionStartDate)

    if(reportAsSurveyData){
        surveyData = reportAsSurveyData.surveyData
        currentUser['reportToUse'] = reportAsSurveyData.reportUse
    }
    if(hasPassed){
        currentUser['isSurveyClosed'] = true
    }

    if(!reportAsSurveyData){
        if(hasPassed){
            let params = {
                currentUserId:currentUser._id,
                currentUserEmail:currentUser.useremail,
                date: maxEndDate.toLocaleString()
            }
            let newReport = await SaveReport(params)
            console.log(newReport, 'newreport1')
            if(newReport?.data  && 'user' in newReport?.data){
                currentUser = newReport.data.user
                const reports = currentUser.reports
                surveyData = JSON.parse(reports[reports.length - 1].data).surveyData
            }
            
        } 
        // else {

        //     if(currentUser.subscription_level < 1 && is_ownerSurveyData_complete){
        //         let params = {
        //             currentUserId:currentUser._id,
        //             currentUserEmail:currentUser.useremail,
        //             date: maxEndDate.toLocaleString()
        //         }
        //         let newReport = await SaveReport(params)
        //         if(newReport?.data  && 'user' in newReport?.data){
        //             currentUser = newReport.data.user
        //             surveyData = JSON.parse(currentUser.reports[0].data).surveyData
        //         }
        //     }
        // }
    }
 

const value = {
    ripple: true,
};


 return <>
    <PrimeReactProvider value={value}>
        <SurveyDataContext surveyData={surveyData}>
        <SessionContextProvider users={allUsers} current_user={currentUser}>
            <AppConfigContextProvider>
                <div className="h-screen flex flex-col max-md:bg-slate-100">
                    <Navbar/>
                    <div className="!bg-slate-100 md:hidden fixed top-0 h-full w-full max-h-32 my-0 mx-auto p-5 md:hidden !shadow-none !z-[99]">
                    <Image
                    className="!h-full !object-contain"
                        src={currentUser?.clinic_logo || "/images/logos/rmc-logo.png"}
                        width={600}
                        height={600}
                        alt="ratemyclinic"
                    />
                
                    </div>
                
                    <div className="h-full max-md:mt-32 max-h-[calc(100vh_-_3.5rem)] md:max-h-[calc(100vh_-_4rem)] overflow-y-hidden flex-1 flex flex-row">
                        <Sidebar/>
                        <div className="flex-1 md:overflow-y-auto">
                            
                                <div className="overflow-scroll max-md:pb-20 min-h-full max-h-[calc(100vh_-_11.25rem)] md:max-h-[calc(100vh_-_4rem)]">
                                {children}
                                </div>
                            
                        </div>
                    </div>
                </div>
            
            </AppConfigContextProvider>
        </SessionContextProvider>
            </SurveyDataContext>
    </PrimeReactProvider>
 </>
}

export default Layout