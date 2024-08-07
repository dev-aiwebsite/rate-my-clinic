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
const currentUser = JSON.parse(JSON.stringify(Users.find(i => i._id == session.user_id)))
const surveyData = await getSurveyData()
const value = {
    ripple: true,
};


 return <>
    <PrimeReactProvider value={value}>
        <SessionContextProvider current_user={currentUser}>
            <div className="h-screen flex flex-col max-md:bg-slate-100">
                <Navbar/>
                <Image
                    className="md:hidden h-42 w-auto m-auto p-5 md:hidden !bg-transparent !shadow-none"
                    src="/images/logos/wrh-logo.png"
                    width={600}
                    height={600}
                    alt="Wrh logo"  
                />
                <div className="flex-1 flex flex-row max-md:!pb-20 max-md:-mt-10">
                    <Sidebar/>
                   <SurveyDataContext surveyData={surveyData}>{children}</SurveyDataContext>
                </div>
            </div>
        </SessionContextProvider>
    </PrimeReactProvider>
 </>
}

export default Layout