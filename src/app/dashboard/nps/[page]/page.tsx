"use client"
import HelperCard from "components/helperCard";
import NpsNavButtonGroup from "components/nps-navigation";
import NpsContent from "components/nps-recommendation";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useSessionContext } from "@/context/sessionContext";
import AppAcess from "lib/appAccess";
import Link from "next/link";


type Titems = {
    [key:string]:any
}
const items:Titems = {
    clients: {
        name: 'Clients',
        color: 'var(--appgreen-300)',
        icon: '/icons/client.svg',
    },
    finance: {
        name: 'Finance',
        color: 'var(--appgreen-300)',
        icon: '/icons/finance.svg',
    },
    strategy: {
        name: 'Strategy',
        color: 'var(--appgreen-300)',
        icon: '/icons/strategy.svg',
    },
    teams:  {
        name: 'Team',
        color: 'var(--appgreen-300)',
        icon: '/icons/team.svg',
    },
}

export default function Page({params}:{params:any}){
    let pageName = params.page
    const {data} = useSurveyDataContext()
    const {currentUser} = useSessionContext()
    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let charts = userAccess?.charts

    let pageEnabled = charts.includes(pageName)

    let item = [
        {
            name: items[pageName].name,
            value: data.summary.clients.score,
            color: items[pageName].color,
            icon:  items[pageName].icon,
        },
        {
            name: 'other',
            value: Number(data.other_summary.clients.score.toFixed(1)),
            color: items[pageName].color,
            icon:  items[pageName].icon,
        }
    ]

    return (<>
        <NpsNavButtonGroup className="max-md:hidden card"/>
        <div className="h-fit min-h-full col-span-3 row-span-5 max-md:!pb-30 md:card md:p-16">
            {pageEnabled && <NpsContent surveyData={data} item={item}/>}
            {!pageEnabled &&
            <div className="flex items-center flex-col gap-2">
                <div className="text-neutral-400 space-x-1">
                    <span className="text-lg !font-bold pi pi-lock"></span>
                    <span>This feature is currently not available.</span>
                </div>
                <Link className="text-orange-400 text-lg underline" href={"/pricing"} target="_blank">Upgrade plan to unlock</Link>
            </div>
                }
           
            <HelperCard className="max-md:mt-6 max-md:w-full max-md:ring-0 md:absolute md:bottom-0 md:right-5"/>
        </div>
    </>
        
);


}