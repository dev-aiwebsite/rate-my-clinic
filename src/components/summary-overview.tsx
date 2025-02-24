import Image from "next/image";
import CircleChart from "./circle-chart"
import MeterChart from "./meter-chart";
import Link from "next/link";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { Fragment, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import GenerateReport from "./generateReport";

type Tparams = {
    surveyData:any,
    additionalClass:string,
    showReport?:boolean,
    enabled?:string[]
}
 const SummaryOverview = ({surveyData,additionalClass = "",showReport = false, enabled = ['clients','strategy','team','finance'] }:Tparams) => {
    const allData = surveyData
let [isOpen, setIsOpen] = useState(false)
function closeModal() {
    setIsOpen(false)
    }

function openModal() {
setIsOpen(true)
}

let clinicName = surveyData?.ownerSurveyData?.clinic_name
const data = [
    {
        name: 'Clients',
        value: surveyData?.summary?.clients?.score || 0,
        color: 'var(--appgreen-300)',
        icon: '/icons/client.svg',
        isEnabled: enabled.includes('clients')
    },
    {
        name: 'Strategy',
        value: surveyData?.summary?.strategy?.score || 0,
        color: 'var(--appgreen-300)',
        icon: '/icons/strategy.svg',
        isEnabled: enabled.includes('strategy')
    },
    {
        name: 'Team',
        value: surveyData?.summary?.team?.score || 0,
        color: 'var(--appblue-200)',
        icon: '/icons/team.svg',
        isEnabled: enabled.includes('team')
    },
    {
        name: 'Finance',
        value: surveyData?.summary?.finance?.score || 0,
        color: 'var(--appblue-200)',
        icon: '/icons/finance.svg',
        isEnabled: enabled.includes('finance')
    },
]

let needle = {
    color: "#004261",
    value: 90,
    title: 'Client'
}


let overAll = [
    {
        name: 'Group A',
        value: surveyData?.overalls?.mine || 0,
        color: '#94BDE5',
    },
    {
        name: 'Average Australian Clinic',
        value: surveyData?.overalls?.other || 0,
        color: '#004261',
    },
]
let diff = overAll[0].value - overAll[1].value
let sign = diff > 0 ? '+' : ''
let subtext = {
    text: `${sign}${diff.toFixed(1)}`,
    class: 'text-red-400 text-[10px]'
}
    let cName = `${additionalClass} md:row-span-4 md:col-span-3 grid grid-cols-1 md:grid-cols-3 max-md:gap-y-6 max-md:gap-x-0 md:gap-6 max-md:!bg-transparent max-md:!shadow-none`;
    return <div className={cName}>
                <div className="max-md:w-full flex flex-col items-center justify-center gap-5 md:border-0 md:border-solid md:border-r md:border-gray-200 max-md:shadow-lg max-md:p-6 max-md:gap-6 max-md:rounded-lg max-md:bg-white">
                    <CircleChart data={overAll} subtext={subtext}/>
                    <div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="h-3 w-3 bg-appblue-300"></div>
                            <span className="text-lg">Overall Rating: {overAll[0].value ? overAll[0].value.toFixed(1) : "-/-"}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="h-3 w-3 bg-appblue-400"></div>
                            <span className="text-xs">Average Australian Clinic: {overAll[1].value.toFixed(1)}</span>
                        </div>
                    </div>
                    {showReport && <>
                       <Link className="font-medium text-gray-400 underline text-orange-400" href="/dashboard/reports">View Report</Link>
                    {/* <button type="button" className="font-medium text-gray-400 underline text-orange-400" onClick={openModal}>Download full report</button> */}
                    </> }
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6 max-md:*:bg-white">
                {data.map((item, index) => {
                    let isEnabled = item.isEnabled
                    if(!isEnabled){
                        item.value = 0
                    }
                    return (
                    <Link key={index} className={`${!isEnabled ? 'disabled' : ""} hover:bg-gray-100 hover:bg-opacity-50 grid grid-cols-1 md:grid-cols-[1fr_4fr] items-center justify-center max-md:gap-4 gap-2 max-md:shadow-lg max-md:p-6 rounded-lg`} href={`/dashboard/nps/${item.name.toLowerCase()}`}>
                        <div className="hidden md:flex flex-col gap-2 items-center">
                            <Image
                                className="max-md:hidden w-[60%] aspect-square" 
                                src={item.icon}
                                alt={item.name}
                                width={60}
                                height={40}
                            />
                            <p className="text-[1.5vw] font-medium">{item?.value || "-/-"}</p>
                        </div>
                        <p className="md:hidden font-medium mx-auto text-center">{item?.name}</p>
                        <div className="flex-1 max-w-40 mx-auto">
                                <MeterChart
                                    data={[
                                        {
                                            value: 100,
                                            color: item.color,
                                        },
                                    ]}
                                    needle={{
                                        color: "",
                                        value: item.value,
                                        title: item.name
                                    }}
                                />
                                <p className="text-xs font-medium mx-auto text-center text-orange-400 underline">See recommendations</p>
                        </div>
                        
                    </Link>
                    )
                })}
                </div>
        </div>
    
}

export default SummaryOverview