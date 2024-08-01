"use client"
import HelperCard from "components/helperCard";
import NpsNavButtonGroup from "components/nps-navigation";
import NpsContent from "components/nps-recommendation";
import { useSurveyDataContext } from "@/context/surveyDataContext";

export default function Page() {
    const {data} = useSurveyDataContext()

    const item = [
        {
            name: 'Strategy',
            value: data.summary.strategy.score,
            color: 'var(--appgreen-300)',
            icon: '/icons/client.svg',
        },
        {
            name: 'other',
            value: Number(data.other_summary.strategy.score.toFixed(1)),
            color: 'var(--appgreen-300)',
            icon: '/icons/client.svg',
        }
    ]
    return (<>
        <NpsNavButtonGroup className="max-md:hidden card"/>
        <div className="h-fit min-h-full col-span-3 row-span-5 max-md:!pb-30 md:card md:p-16">
            <NpsContent surveyData={data} item={item}/>
            <HelperCard className="max-md:mt-6 max-md:w-full max-md:ring-0 md:absolute md:bottom-0 md:right-5"/>
        </div>
    </>
    );
}