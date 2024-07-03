"use client"
import NpsChart from "@/components/nps-chart";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useState } from "react";

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

export default function Page({searchParams}:{searchParams:any}) {
    const [selected, setSelected] = useState(1)
    const {currentUser} = useSessionContext()
    const {data} = useSurveyDataContext()
    let filteredData 
    let npsCategory = searchParams.nps

    if(npsCategory == 'client'){

        filteredData = data.clientSurveyData.filter((i:any)=> i.clinicid == currentUser._id)
    } else if(npsCategory == 'team'){
        filteredData = data.teamSurveyData.filter((i:any)=> i.clinicId == currentUser._id)
    } else {
        filteredData = data.clientSurveyData.filter((i:any)=> i.clinicid == currentUser._id)
    }


    let npsValues: number[] = []
    let npsData:npsData = filteredData.map((i)=> {

        const date = new Date(i.createdAt);
        const formattedDate = date.toISOString().split('T')[0];

        let comment = i.recommendation_feedback
        if(npsCategory == 'team'){
            comment = `${i.fname}  ${i.lname}`
        }

        let nps:npsItem = {
            'date':formattedDate,
            'value': Number(i.recommendation),
            'comment': comment
        }
        npsValues.push(Number(i.recommendation))

       return nps
    })


    
    const sum = npsValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Calculate the average
    const npsAverage = sum / npsValues.length;


    function handleSelection(index:number){
        setSelected(index)
    }

    return (<>
        <div className="col-span-3 row-span-1 flex flex-row items-center justify-between card">
            <h1 className="text-2xl capitalize">{npsCategory || 'Client'} NPS: {npsAverage}</h1>
            {/* <ul className="text-xs flex-1 max-w-md grid gap-[1px] grid-cols-3 divide-x *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
                <li onClick={() => handleSelection(1)} className={selected === 1 ? '!bg-orange-400 text-white' : ''} >Select date</li>
                <li onClick={() => handleSelection(2)} className={selected === 2 ? '!bg-orange-400 text-white' : ''} >dd/mm/yy</li>
                <li onClick={() => handleSelection(3)} className={selected === 3 ? '!bg-orange-400 text-white' : ''} >dd/mm/yy</li>
            </ul> */}
        </div>

        <div className="col-span-3 row-span-5 h-fit max-md:!pb-30 md:card">
            <NpsChart data={npsData} />
        </div>
    </>);
}