import Recommendations, { recommendationBank, Tcategory } from "lib/recommendations";
import HelperCard from "./helperCard";
import MeterChart from "./meter-chart";
import Image from "next/image";


interface Item {
    [key:number]: {
        name: string;
        value: number;
        color: string;
        icon: string;
    }
 
}[]
const scoreTypeList = ['below','in line with', 'above']
export default function NpsContent({surveyData,item,className}:{surveyData:any,item:Item,className?:string}) {
    let discrepancy = item[0].value - item[1].value
    let discrepancy_display_text = discrepancy < 0 ? `${discrepancy.toFixed(1)}` : `+${discrepancy.toFixed(1)}`

    let scoreType = 'in line with'

    if(discrepancy < 0){
        scoreType = scoreTypeList[0]
    } else if(discrepancy == 0){
        scoreType = scoreTypeList[1]
    } else if(discrepancy > 0){
        scoreType = scoreTypeList[2]
    }

    let category = `${item[0].name.toLowerCase()}` as Tcategory
    const recommendations = Recommendations({surveyData,category})

    return (
        <div className={`${className} flex flex-col gap-14`}>
            {<div className="flex flex-row items-end justify-around max-md:card">
                    <div className="flex flex-col gap-2 items-center flex-1 md:max-w-[160px]">
                        {item[0].icon && <Image
                            className="max-md:max-w-[100px] w-[60%] aspect-square" 
                            src={item[0].icon}
                            alt={item[0].name}
                            width={40}
                            height={40}
                        />}
                        <div className="text-3xl whitespace-nowrap">
                            <span>{item[0].name}</span> : <span className="text-red-400">{discrepancy_display_text}</span>
                        </div>
                        <div className="text-base md:hidden text-center">
                            <span>Your score</span> : <span>{item[0].value}</span>
                        </div>
                        <div className="md:hidden text-center">
                            <span>Average Australian Clinic</span> : <span>{item[1].value}</span>
                        </div>
                        
                    </div>
                    <div className="grid grid-cols-2 w-full">
                        <div className="max-md:hidden flex-1 max-w-96">
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

                        <div className="max-md:hidden flex-1 max-w-96">
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
            }

            <div className="col-span-3 flex gap-7 flex-col row-span-5 text-md">
                <div>
                    <p className="font-medium">Key points include:</p>
                    <ul className="text-sm text-neutral-500 pl-5 mt-3 list-disc">
                        <li>Your score is {scoreType} the current national average</li>

                    </ul>
                </div>

                <div>
                    <p className="font-medium">Recommendations</p>
                    <ul className="text-sm text-neutral-500 pl-5 mt-3 list-disc space-y-2">
                    {
                        recommendations.map((i,index) => <li key={index}>{i}</li>)
                    }
                    </ul>
                
                </div>
            </div>

        </div>
    );
}