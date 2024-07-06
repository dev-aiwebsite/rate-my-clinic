"use client"
import NpsChart from "@/components/nps-chart";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";

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

    return (<>
        <div className="col-span-3 row-span-1 flex flex-row items-center justify-between card">
            <h1 className="text-2xl capitalize">{npsCategory || 'Client'} NPS: {npsAverage}</h1>
        </div>

        <div className="col-span-3 row-span-5 h-fit max-md:!pb-30 md:card">
            <NpsChart data={npsData} />
        </div>
    </>);
}