import Recommendations, {Tcategory } from "lib/recommendations";
import HelperCard from "./helperCard";
import MeterChart from "./meter-chart";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useSessionContext } from "@/context/sessionContext";


interface Item {
    [key:number]: {
        name: string;
        value: number;
        color: string;
        icon: string;
    }
 
}[]
const scoreTypeList = ['below','in line with', 'above']
export default function NpsContent({surveyData,item,className}:{surveyData?:any,item:Item,className?:string}) {
    const {currentUser} = useSessionContext()
    let discrepancy = item[0].value - item[1].value
    let discrepancy_display_text = discrepancy < 0 ? `${discrepancy.toFixed(1)}` : `+${discrepancy.toFixed(1)}`
    let recommendations = [] as string[]
    let category = `${item[0].name.toLowerCase()}` as Tcategory
    if(currentUser.reports && currentUser?.reportToUse){
        let lastReportJson = currentUser.reports[currentUser.reports.length - 1].data
        let lastReport

        if(lastReportJson){
            lastReport =JSON.parse(lastReportJson)
            surveyData = lastReport.surveyData
            recommendations = lastReport.recommendations[category]
        }
    }


    let scoreType = 'in line with'

    if(discrepancy < 0){
        scoreType = scoreTypeList[0]
    } else if(discrepancy == 0){
        scoreType = scoreTypeList[1]
    } else if(discrepancy > 0){
        scoreType = scoreTypeList[2]
    }


    return (
        <div className={`${className} flex flex-col gap-14`}>
            <div className="flex flex-row items-end justify-around group-[:not(.pdf\_page)]:max-md:card gap-10">
                    <div className="flex flex-col gap-2 items-center flex-1">
                        {item[0].icon && <Image
                            className="group-[:not(.pdf\_page)]:max-md:max-w-[100px] w-[60%] aspect-square" 
                            src={item[0].icon}
                            alt={item[0].name}
                            width={40}
                            height={40}
                        />}
                        <div className="text-3xl whitespace-nowrap">
                            <span>{item[0].name}</span> : <span className="text-red-400">{discrepancy_display_text}</span>
                        </div>
                        <div className="text-base group-[.pdf\_page]:!hidden md:hidden text-center">
                            <span>Your score</span> : <span>{item[0].value}</span>
                        </div>
                        <div className="group-[.pdf\_page]:!hidden md:hidden text-center">
                            <span>Average Australian Clinic</span> : <span>{item[1].value}</span>
                        </div>
                        
                    </div>
                    <div className="group-[:not(.pdf\_page)]:max-md:hidden grid grid-cols-2 w-full gap-10">
                        <div className="group-[:not(.pdf\_page)]:max-md:hidden flex-1 max-w-96">
                            <p className="text-xs text-neutral-400 text-center mb-3">Your Score</p>
                            <MeterChart
                                data={[
                                    {
                                        value: 100,
                                        color: item[0].color,
                                    },
                                ]}
                                needle={{
                                    color: "",
                                    value: item[0].value,
                                    title: item[0].value.toString()
                                }}
                            />
                        </div>

                        <div className="group-[:not(.pdf\_page)]:max-md:hidden flex-1 max-w-96">
                            <p className="text-xs text-neutral-400 text-center mb-3">Australian Clinic Average</p>
                            <MeterChart
                                data={[
                                    {
                                        value: 100,
                                        color: item[1].color,
                                    },
                                ]}
                                needle={{
                                    color: "",
                                    value: item[1].value,
                                    title: item[1].value.toString()
                                }}
                            />
                        </div>
                    </div>
                </div>
            

            <div className="col-span-3 flex gap-7 flex-col row-span-5 text-md">
                <div>
                    <p className="font-medium">Key points include:</p>
                    <ul className="text-sm text-neutral-500 pl-5 mt-3 list-disc">
                        <li>Your score is {scoreType} the current national average</li>

                    </ul>
                </div>

                {recommendations.length ? <><div>
                    <p className="font-medium">Recommendations</p>
                    <ul className="text-sm text-neutral-500 pl-5 mt-3 list-disc space-y-2">
                    {
                        recommendations.map((i,index) => <li key={index}>{i}</li>)
                    }
                    </ul>
                
                </div>
                </> : <></>}
            </div>

        </div>
    );
}