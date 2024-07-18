"use client"
import Image from "next/image";
import { useState } from "react";
import { Tooltip } from 'primereact/tooltip'
import CopyButton from "./copy-text-button";
        

type DataType = {
    date: string;
    value: number;
    comment:string;
}[] | null;
export interface NpsTogglerType {
    detractors: number;
    passives: number;
    promoters: number;
}

interface DataVisibilityType {
    "detractors": boolean;
    "passives": boolean;
    "promoters": boolean;
}

export default function NpsChart({data}:{data?:DataType}) {

    const [dataVisibility, setDataVisibility] = useState({
        detractors: true,
        passives: true,
        promoters: true
    });
      
    const numbers = Array.from({ length: 10 }, (_, i) => 10 - i);
    const togglerDataMap:NpsTogglerType = {
        "detractors": 0,
        "passives": 0,
        "promoters": 0
    }
    let chartItems:any = []

    if(data){
        // Sort the data based on the date
        data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // Classify the values

        data.forEach((item,index) => {
            let iconPath
            let dataType:"promoters" | "detractors" | "passives"
            if (item.value >= 9) {
                togglerDataMap.promoters += 1;
                dataType = "promoters"
                iconPath = "/icons/smiley-good.svg"
            } else if (item.value <= 6) {
                togglerDataMap.detractors += 1;
                dataType = "detractors"
                iconPath = "/icons/smiley-bad.svg"

            } else {
                togglerDataMap.passives += 1;
                dataType = "passives"
                iconPath = "/icons/smiley-neutral.svg"
            }

            if(!dataVisibility[dataType]) return
            chartItems.push (
                <div className="grid grid-rows-10 h-full row-span-full w-40 relative"
                data-npsdataclass={dataType}
                key={index}>
                    <span className={`row-start-${11 - item.value} block leading-[0px] -translate-y-1/2`}>
                        <Tooltip target=".custom-tooltip-btn" autoHide={false} position="bottom">
                            <div className="max-w-[250px] text-sm">
                            {item.comment}
                            <CopyButton className="float-right !p-1 !ring-0"
                                textToCopy={"Professional expert advice delivered in a considered friendly manner with great hands on therapy."} toolTip="Copy text"/>
                                
                            </div>
                        </Tooltip>
                        <Image className="custom-tooltip-btn h-full mx-auto" src={iconPath} width={40} height={40} alt="smiley" />
                    </span>
                    <span className="absolute bottom-0 text-xs text-center w-full  translate-y-[200%]">{item.date}</span>
                </div>
            )

            
        });

    }
    function handleClick(dataType:"detractors" | "passives" | "promoters") {

        console.log('Button clicked!',dataVisibility);

        setDataVisibility({...dataVisibility,
            [dataType]: !dataVisibility[dataType]
        })
    }
    return (<>
        <div className="width-full flex flex-col h-auto">
                    
            <div className="text-sm text-neutral-500 font-[300] flex items-center justify-center gap-5">
                <button className="flex flex-row gap-2 items-center shadow-sm ring-1 ring-gray-200 hover:shadow-lg bg-white rounded-full py-2 px-3"
                onClick={() => handleClick("detractors")}>
                    <Image
                        className="w-5 h-5"
                        src="/icons/smiley-bad.svg"
                        alt=""
                        width={5}
                        height={5}
                    />
                    <div className={`${!dataVisibility.detractors ? "line-through" : ""}`}>
                        <span>{togglerDataMap.detractors}</span> <span>Detractors</span>
                    </div>
                </button>
                <button className="flex flex-row gap-2 items-center shadow-sm ring-1 ring-gray-200 hover:shadow-lg bg-white rounded-full py-2 px-3"
                onClick={() => handleClick('passives')}>

                    <Image
                        className="w-5 h-5"
                        src="/icons/smiley-neutral.svg"
                        alt=""
                        width={5}
                        height={5}
                    />
                    <div className={`${!dataVisibility.passives ? "line-through" : ""}`}>
                        <span>{togglerDataMap.passives}</span> <span>Passive</span>
                    </div>
                </button>
                <button className="flex flex-row gap-2 items-center shadow-sm ring-1 ring-gray-200 hover:shadow-lg bg-white rounded-full py-2 px-3"
                onClick={() => handleClick("promoters")}>
                    <Image
                        className="w-5 h-5"
                        src="/icons/smiley-good.svg"
                        alt=""
                        width={5}
                        height={5}
                    />
                    <div className={`${!dataVisibility.promoters ? "line-through" : ""}`}>
                        <span>{togglerDataMap.promoters}</span> <span>Promoters</span>
                    </div>
                </button>
            </div>
        

                    <div className="h-full w-full flex flex-col py-10 px-5 my-10">

                        <div className="h-full flex-1 flex relative">
                             <div className="absolute grid grid-rows-10 h-full w-full pointer-events-none z-0">
                                {numbers.map((number) => (
                                <div key={number} className="border-0 border-dashed border-t-2 border-gray-200">
                                </div>
                                ))}
                            </div>
                            <div className="no-scrollbar overflow-y-clip grid grid-rows-10 h-[calc(100%_+_4rem)] py-8 -my-8 overflow-x-auto flex-1 z-2 relative">
                               {chartItems}
                            </div>
                            <div className="grid grid-rows-10 h-auto">
                                {numbers.map((number) => (
                                <div key={number} className="text-xs text-neutral-500 border-0 border-l-4 border-t-4 border-gray-200">
                                    <span className="block -translate-y-[calc(50%_+_2px)] translate-x-full">{number}</span>
                                </div>
                                ))}
                            </div>
                        </div>

                        <div className="w-full text-xs text-neutral-500 border-0 border-t-4 border-gray-200 relative">
                            <span className="absolute right-0 -translate-y-[calc(50%_+_2px)] translate-x-full">0</span>
                        </div>

                    </div>
        </div>

        
        </>
    );
}