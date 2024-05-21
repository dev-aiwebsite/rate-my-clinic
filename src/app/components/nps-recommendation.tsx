import HelperCard from "./helperCard";
import MeterChart from "./meter-chart";
import Image from "next/image";



interface Item {
    name: string;
    value: number;
    color: string;
    icon: string;
}

export default function NpsContent({item}:{item:Item}) {
    
    return (
        <div className="flex flex-col gap-14">
            {<div className="flex flex-row items-end justify-around">
                    <div className="flex flex-col gap-2 items-center flex-1 max-w-[160px]">
                        <Image
                            className="w-[60%] aspect-square" 
                            src={item.icon}
                            alt={item.name}
                            width={40}
                            height={40}
                        />
                        <div className="text-base md:text-2xl">
                            <span>{item.name}</span> : <span className="text-red-400">{item.value}</span>
                        </div>
                    </div>
                
                    <div className="flex-1 max-w-96">
                    <p className="text-xs text-neutral-400 text-center mb-3">Your Score</p>
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
                                title: item.value.toString()
                            }}
                        />
                    </div>

                    <div className="flex-1 max-w-96">
                        <p className="text-xs text-neutral-400 text-center mb-3">Australian Clinic Type Clinic Average</p>
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
                                title: item.value.toString()
                            }}
                        />
                    </div>
                </div>
            }

            <div className="col-span-3 flex gap-7 flex-col row-span-5 text-md">
                <div>
                    <p className="font-medium">Key points include:</p>
                    <ul className="text-sm text-neutral-400 pl-5 mt-3 list-disc list-inside">
                        <li>Your score is in line with, above, below the current national average</li>

                    </ul>
                </div>

                <div>
                    <p className="font-medium">Recommendations</p>
                    <ul className="text-sm text-neutral-400 pl-5 mt-3 list-disc list-inside">
                        <li>We recommend a 1-2 page plan specific to the financial year with clear S.M.A.R.T goals.</li>
                        <li>Commence work on your business plan for FY25.</li>
                        <li>We recommend you review your progress quarterly.</li>
                        <li>We recommend reviewing your exit strategy annually.</li>
                        

                    </ul>
                
                </div>
            </div>

        </div>
    );
}