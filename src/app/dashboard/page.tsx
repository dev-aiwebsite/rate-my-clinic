"use client"
import SummaryOverview from "components/summary-overview";
import SyncButton from "components/sync-btn";
import HelperCard from "components/helperCard";
import Link from "next/link";
import CircleChart from "components/circle-chart";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { redirect, usePathname } from "next/navigation";
import AppAcess from "lib/appAccess";
import ConvertToPDF from "components/generateReport";
import { useEffect } from "react";

type npsData = {
    date: string;
    value: number;
    comment:string;
}[] | null;


type npsItem = {
    date: string;
    value: number;
    comment:string;
};

const defaultNps = [
    {
        name: 'Group A',
        value: 0,
        color: '#94BDE5',
    },
]

export default function Page(){ 
    const {data,setData} = useSurveyDataContext()
    const {currentUser,setCurrentUser} = useSessionContext()
    const pathname = usePathname()

    console.log(data)
    
    if(!currentUser) return
    let tocheck = ['profile_pic','clinic_name','clinic_established','clinic_location_country','clinic_location_postcode','clinic_location_state','clinic_logo','usermobile']
    const isProfileComplete = tocheck.every(i => currentUser[i])
    
    if(pathname != '/dashboard/settings/account'){
        if(!isProfileComplete){
            redirect('/dashboard/settings/account')
        }
    }
    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let charts = userAccess?.charts
    let userName = currentUser?.username || "Guest"
    
    let is_ownerSurveyData_complete = data?.ownerSurveyData ? true : false
    let daysRemaining
    let showReport = false

    let clientNps = defaultNps, teamNps = defaultNps, clientNpsAvg = 0,teamNpsAvg = 0

    if(is_ownerSurveyData_complete){
        if(data.ownerSurveyData){
            const maxDays = 10;
            let createdAt = new Date(data.ownerSurveyData.createdAt); // Assuming data.ownerSurveyData.createdAt is a valid date string
            let today = new Date();
            
            // Calculate the date that is 10 days after createdAt
            let maxDate = new Date(createdAt);
            maxDate.setDate(maxDate.getDate() + maxDays);
            
            // Calculate the difference in time (in milliseconds)
            let timeDifference = maxDate.getTime() - today.getTime();
            
            // Calculate the difference in days
            daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24));
            
            


            
        }
        
        if(data){
            let filteredData = data.clientSurveyData.filter((i:any)=> i.clinicid == currentUser._id)
            let filteredData_team = data.teamSurveyData.filter((i:any)=> i.clinicId == currentUser._id)
            let npsValues: number[] = []
            let npsValues_team: number[] = []
            filteredData.forEach((i)=> {
    
                const date = new Date(i.createdAt);
                const formattedDate = date.toISOString().split('T')[0];

                npsValues.push(Number(i.recommendation))
    
            })
    
            const sum = npsValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            clientNpsAvg = sum / npsValues.length || 0
    
    
            filteredData_team.forEach((i)=> {
                npsValues_team.push(Number(i.recommendation))
            })
            
            const sum2 = npsValues_team.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            teamNpsAvg = sum2 / npsValues_team.length || 0
    
        }
    
        clientNps = [
            {
                name: 'Group A',
                value: Number(clientNpsAvg.toFixed(1)),
                color: '#94BDE5',
            },
        ]
    
        teamNps = [
            {
                name: 'Group A',
                value: Number(teamNpsAvg.toFixed(1)),
                color: '#94BDE5',
            },
        ]
    }

    let headerInfoText = ''


    if(is_ownerSurveyData_complete){
        if(daysRemaining && daysRemaining > 0){
            headerInfoText = `You have ${daysRemaining} days till your final report is generated`
        } else {
            headerInfoText = `Your final report is generated`
            showReport = true
        }
    } else {
         headerInfoText = 'To access app functionality, please complete the Owner survey.'
    }


    return (<div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 max-md:flex max-md:flex-row max-md:flex-wrap md:grid md:grid-cols-3">
            <div className="card hidden col-span-3 row-span-1 md:flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl inline-block mr-2 capitalize">{userName}</h1>
                    <span className="text-gray-400 text-base">{headerInfoText} {!is_ownerSurveyData_complete && 
                        <Link className="inline-flex btn btn-primary " href="/dashboard/owner-survey">Owner survey</Link>
                    }</span>
                </div>
                <div className="m-w-42">
                    <SyncButton/>
                </div>
            </div>
            
                <SummaryOverview enabled={charts} showReport={showReport} surveyData={data} additionalClass={`card max-md:basis-full !px-0 md:*:px-6 gap-6 ${is_ownerSurveyData_complete ? "" : 'disabled'}`}/>
                <div className={`card md:row-span-1 max-md:basis-full ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                    <Link className="h-full gap-5 flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=client">
                        <div className="flex-1 min-w-24 grid items-center justify-around">
                            <p>Client NPS</p>
                            <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                        </div>
                        <CircleChart data={clientNps} max={10}/>
                    </Link>
                </div>
                <div className={`card md:row-span-1 max-md:basis-full ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                    <Link className="h-full gap-5 flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=team">
                        <div className="flex-1 min-w-24 grid items-center justify-around">
                            <p>Team Satisfaction</p>
                            <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                        </div>
                        <CircleChart data={teamNps} max={10}/>
                    </Link>
                </div>
                <div className={`card md:row-span-1 !p-0 max-md:basis-full ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                    <HelperCard className="!ring-0"/>
                </div>
           
            
        </div>
    )};



