"use client"
import SummaryOverview from "@/components/summary-overview";
import SyncButton from "@/components/sync-btn";
import HelperCard from "@/components/helperCard";
import Link from "next/link";
import CircleChart from "@/components/circle-chart";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { getSurveyData } from "@/server-actions";
import { useState } from "react";
import { formatDistanceToNow } from 'date-fns';

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

export default function Page(){ 

    const {currentUser,setCurrentUser} = useSessionContext()
    let userName = currentUser?.username || "Guest"
    const {data,setData} = useSurveyDataContext()
   
    let clientNpsAvg,teamNpsAvg

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
        clientNpsAvg = sum / npsValues.length;


        filteredData_team.forEach((i)=> {
            npsValues_team.push(Number(i.recommendation))
        })
        
        const sum2 = npsValues_team.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        teamNpsAvg = sum2 / npsValues_team.length;

    }

    let clientNps = [
        {
            name: 'Group A',
            value: clientNpsAvg || 0,
            color: '#94BDE5',
        },
    ]

    let teamNps = [
        {
            name: 'Group A',
            value: teamNpsAvg || 0,
            color: '#94BDE5',
        },
    ]

    return (<div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 max-md:flex max-md:flex-row max-md:flex-wrap md:grid md:grid-cols-3 *:bg-white *:shadow-lg *:rounded-md *:py-6 *:px-6">
            <div className="hidden col-span-3 row-span-1 md:flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl inline-block mr-2 capitalize">{userName}</h1>
                    <span className="text-gray-400 text-base">You have 10 days till your final report is generated</span>
                </div>
                <div className="m-w-42">
                    <SyncButton/>
                </div>
            </div>

            <SummaryOverview surveyData={data} additionalClass="max-md:basis-full !px-0 md:*:px-6 gap-6"/>

            <div className="md:row-span-1 max-md:basis-full">
                <Link className="flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=client">
                    <div>
                        <p>Client NPS</p>
                        <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                    </div>
                    <CircleChart data={clientNps} max={10}/>
                </Link>
            </div>

            <div className="md:row-span-1 max-md:basis-full">
                <Link className="flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps?nps=team">
                    <div>
                        <p>Team NPS</p>
                        <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                    </div>
                    <CircleChart data={teamNps} max={10}/>
                </Link>
            </div>
            <div className="md:row-span-1 !p-0 max-md:basis-full">
                <HelperCard className="!ring-0"/>
            </div>

            
        </div>
    )};
