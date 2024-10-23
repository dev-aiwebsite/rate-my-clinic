"use client"
import NpsChart from "../../../components/nps-chart";
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
    name?: string;

};

export default function Page({searchParams}:{searchParams:any}) {
    const {currentUser} = useSessionContext()
    const {data} = useSurveyDataContext()
    let hasAccess = currentUser.subscription_level > 0 || false
    let filteredData 
    let npsCategory = searchParams.nps
    let npsTextHeader = 'Client NPS'

    if(npsCategory == 'team'){
        npsTextHeader = 'Team Satisfaction'
        filteredData = data?.teamSurveyData?.filter((i:any)=> i.clinicId == currentUser._id) || null
    } else {
        filteredData = data?.clientSurveyData?.filter((i:any)=> i.clinicid == currentUser._id) || null
    }


    let npsValues: number[] = []
    let npsData:npsData = filteredData?.map((i)=> {

        const date = new Date(i.createdAt);
        const formattedDate = date.toISOString().split('T')[0];

        let comment = i.strengths
        let name = i.fname

        if(npsCategory != 'team'){
            comment = `${i.recommendation_feedback}`
            // comment = `${i.fname}  ${i.lname}`
        }

        let nps:npsItem = {
            'date':formattedDate,
            'value': Number(i.recommendation),
            'comment': comment,
            'name': name
        }
        npsValues.push(Number(i.recommendation))

       return nps
    })


    
    const sum = npsValues.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Calculate the average
    let npsAverage = (sum / npsValues.length).toFixed(1)

    if(npsCategory != 'team'){
        npsAverage = (Number(npsAverage) * 10).toFixed(1)
    }

    if(isNaN(sum / npsValues.length)){
        npsAverage = "0.0"
    }

    if(!hasAccess){
        npsAverage = "--"
    }

    return (<>
        <div className="col-span-3 row-span-1 flex flex-row items-center justify-between card">
            <h1 className="text-2xl capitalize">{`${npsTextHeader}: ${npsAverage}`}</h1>
        </div>

        <div className="col-span-3 row-span-5 h-fit max-md:!pb-30 card">
           {hasAccess ?  (<NpsChart data={npsData} /> ) : (<NpsChart enabled={false}/>)}
        </div>
    </>);
}