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
import { getSurveyData } from "lib/server-actions";



const Layout = async ({
   children,
 }: Readonly<{
   children: React.ReactNode;
 }>) => {

const session = await auth() as unknown as ExtendedSession
const Users = await fetchData()
const c_user = JSON.stringify(Users.find(i => i._id == session.user_id))
const currentUser = JSON.parse(c_user)

const surveyData = await getSurveyData()
const value = {
    ripple: true,
};


 return <>
    <PrimeReactProvider value={value}>
        <SessionContextProvider current_user={currentUser}>
            <div className="h-screen flex flex-col max-md:bg-slate-100">
                <Navbar/>
                <div className="!bg-slate-100 md:hidden sticky top-0 h-full w-full  max-h-32 my-0 mx-auto p-5 md:hidden !bg-transparent !shadow-none">
                <Image
                    className="max-h-32 mx-auto w-auto"
                    src="/images/logos/wrh-logo.png"
                    width={600}
                    height={600}
                    alt="Wrh logo"  
                />
                </div>
               
                <div className="h-full max-h-[calc(100vh_-_11.25rem)] overflow-y-hidden flex-1 flex flex-row">
                    <Sidebar/>
                    <div className="flex-1 overflow-y-auto">
                        <SurveyDataContext surveyData={surveyData}>
                            {children}
                        </SurveyDataContext>
                    </div>
                </div>
            </div>
        </SessionContextProvider>
    </PrimeReactProvider>
 </>
}

export default Layout