"use client"
import { IoIosArrowRoundBack } from "react-icons/io"
import Link from "next/link"
import SingleUserPageTemplate from "components/singe-user-page-template"
import { useEffect, useState } from "react"
import { useSessionContext } from "@/context/sessionContext"
import { getSurveyData } from "lib/server-actions"
import { ProgressSpinner } from "primereact/progressspinner"
import { redirect, useRouter } from "next/navigation"

type TsurveyData = {
    other: {
        [key: string]: any;
    }[];
    other_summary: {};
    oldData: any[];
    overalls: {
        [key: string]: any;
    };
    summary: {
        [key: string]: any;
    };
    ownerSurveyData?: any;
    clientSurveyData?: any;
    teamSurveyData?: any;
} | null
export default function Page({params}:{params:any}){
        const {currentUser, users} = useSessionContext()
        const [surveyData, setSurveyData] = useState<TsurveyData>(null)
        if (currentUser.role != 'admin') {
            redirect('/dashboard') // Redirect to /dashboard
        }
      
        console.log(surveyData)
            useEffect(()=> {
                if(surveyData) return
                let user = users.find((i: { _id: string }) => i._id == params.user_id)
                if(!user) return
                const getSD = async() => {
                    let SD = await getSurveyData(params.user_id)
                    console.log(SD, 'SD')
                    if(SD){
                        setSurveyData(SD)
                    }
                }   
                getSD()
            },[])

        return <>
         <Link className="m-2 block w-fit rounded-lg bg-transparent hover:bg-gray-100 p-2"
                 href={"/dashboard/admin"}><IoIosArrowRoundBack size={32} /></Link>



        <div className="card m-5">
            {!surveyData ? <>
                <div className="flex justify-content-center">
                    <ProgressSpinner />
                </div>
            </> :  <SingleUserPageTemplate surveyData={surveyData}></SingleUserPageTemplate>
            }
           
        </div>
        </>

}