"use client"
import HelperCard from "components/helperCard";
import NpsNavButtonGroup from "components/nps-navigation";
import NpsContent from "components/nps-recommendation";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useSessionContext } from "@/context/sessionContext";
import AppAcess from "lib/appAccess";
import Link from "next/link";
import UpgradePlanBlock from "components/upgrade-plan-block";
import { useState } from "react";
import { useAppConfigContext } from "@/context/appSettingsContext";


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
    team:  {
        name: 'Team',
        color: 'var(--appgreen-300)',
        icon: '/icons/team.svg',
    },
}

export default function Page({params}:{params:any}){
    let pageName = params.page
    
    const {data} = useSurveyDataContext()
    const {currentUser} = useSessionContext()
    const {appUserConfig,setAppUserConfig} = useAppConfigContext()

    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let charts = userAccess?.charts
    console.log(pageName)
    console.log(data, 'data')
    console.log(currentUser)
    
    let npsCategory = pageName

    if(pageName == 'team'){
        npsCategory = 'team'
    }

    if(!data){
        console.log(data,'no data')
        return false
    }

    if (!items[pageName]) {
        console.log(`Invalid pageName: ${pageName}`);
        return <div>Invalid page</div>;
    }
    const itemValueOne = data?.summary[npsCategory]?.score || 0
    const itemValueTwo = data?.other_summary[npsCategory]?.score || 0
    let pageEnabled = charts.includes(pageName)
    // let pageEnabled = true

    
    let item = [
        {
            name: items[pageName].name,
            value: itemValueOne,
            color: items[pageName].color,
            icon:  items[pageName].icon,
        },
        {
            name: 'other',
            value: Number(itemValueTwo.toFixed(1)),
            color: items[pageName].color,
            icon:  items[pageName].icon,
        }
    ]
    function  handleHelperOnClose(){
        const UpdatedConfig = {
            ...appUserConfig
        }
        UpdatedConfig.helper_card.display = false
        setAppUserConfig(UpdatedConfig)
    }
    return (<>
        <NpsNavButtonGroup className="max-md:hidden card"/>
        <div className="group h-fit min-h-full col-span-3 row-span-5 max-md:!pb-30 md:card md:p-16">
            {pageEnabled && <NpsContent surveyData={data} item={item}/>}
            {!pageEnabled &&
            <div className="flex items-center flex-col gap-2 text-center">
               <UpgradePlanBlock/>
            </div>
                }
           
            <HelperCard isVisible={appUserConfig.helper_card.display} onClose={handleHelperOnClose} canClose={true} className="max-md:mt-6 max-md:w-full max-md:ring-0 md:absolute md:bottom-0 md:right-5"/>
        </div>
    </>
        
);


}