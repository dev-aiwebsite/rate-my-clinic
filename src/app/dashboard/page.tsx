"use client"
import SummaryOverview from "@/components/summary-overview";
import SyncButton from "@/components/sync-btn";
import HelperCard from "@/components/helperCard";
import Link from "next/link";
import CircleChart from "@/components/circle-chart";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { redirect, usePathname } from "next/navigation";



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

    if(!currentUser) return
    let tocheck = ['profile_pic','clinic_name','clinic_established','clinic_location_country','clinic_location_postcode','clinic_location_state','clinic_logo','usermobile']
    const isProfileComplete = tocheck.every(i => currentUser[i])
    
    if(pathname != '/dashboard/settings/account'){
        if(!isProfileComplete){
            redirect('/dashboard/settings/account')
        }
    }



    let userName = currentUser?.username || "Guest"
    
    let is_ownerSurveyData_complete = data?.ownerSurveyData ? true : false

    let clientNps = defaultNps,teamNps = defaultNps, clientNpsAvg = 0,teamNpsAvg = 0

    if(is_ownerSurveyData_complete){
        if(data){
            let filteredData = data.clientSurveyData.filter((i:any)=> i.clinicid == currentUser._id)
            let filteredData_team = data.teamSurveyData.filter((i:any)=> i.clinicId == currentUser._id)
            let npsValues: number[] = []
            let npsValues_team: number[] = []
            filteredData.forEach((i)=> {
    
                const date = new Date(i.createdAt);
                const formattedDate = date.toISOString().split('T')[0];
    
                // let nps:npsItem = {
                //     'date':formattedDate,
                //     'value': Number(i.recommendation),
                //     'comment': i.recommendation_feedback
                // }
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
        headerInfoText = 'You have 10 days till your final report is generated'
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
            
                <SummaryOverview surveyData={data} additionalClass={`card max-md:basis-full !px-0 md:*:px-6 gap-6 ${is_ownerSurveyData_complete ? "" : 'disabled'}`}/>
                <div className={`card md:row-span-1 max-md:basis-full ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                    <Link className="flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=client">
                        <div>
                            <p>Client NPS</p>
                            <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                        </div>
                        <CircleChart data={clientNps} max={10}/>
                    </Link>
                </div>

                <div className={`card md:row-span-1 max-md:basis-full ${is_ownerSurveyData_complete ? "" : 'disabled'}`}>
                    <Link className="flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=team">
                        <div>
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


