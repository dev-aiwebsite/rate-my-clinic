import Image from "next/image";
import CircleChart from "./circle-chart"
import MeterChart from "./meter-chart";
import Link from "next/link";

 const SummaryOverview = ({surveyData,additionalClass = ""}:{surveyData:any,additionalClass:string}) => {
console.log(surveyData)
const data = [
    {
        name: 'Clients',
        value: surveyData?.summary.clients?.score || 0,
        color: 'var(--appgreen-300)',
        icon: '/icons/client.svg',
    },
    {
        name: 'Strategy',
        value: surveyData?.summary.strategy.score || 0,
        color: 'var(--appgreen-300)',
        icon: '/icons/strategy.svg',
    },
    {
        name: 'Teams',
        value: surveyData?.summary.team.score || 0,
        color: 'var(--appblue-200)',
        icon: '/icons/team.svg',
    },
    {
        name: 'Finance',
        value: surveyData?.summary.finance.score || 0,
        color: 'var(--appblue-200)',
        icon: '/icons/finance.svg',
    },
]



let needle = {
    color: "#004261",
    value: 90,
    title: 'Client'
}

let total = data.map(i => i.value).reduce((acc, curr) => acc + curr, 0)
let totalAverage = total / 4;

let overAll = [
    {
        name: 'Group A',
        value: totalAverage,
        color: '#94BDE5',
    },
    {
        name: 'Average Australian Clinic',
        value: 50,
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
                            <span className="text-lg">Overall Rating: {totalAverage.toFixed(1) || "-/-"}</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="h-3 w-3 bg-appblue-400"></div>
                            <span className="text-xs">Average Australian Clinic: {overAll[1].value}</span>
                        </div>
                    </div>
                    {/* <a className="font-medium text-gray-400 underline text-orange-400" href="#">See full report</a> */}
                </div>
                <div className="md:col-span-2 grid grid-cols-2 gap-4 md:gap-6 max-md:*:bg-white">
                {data.map((item, index) => (
                    <Link key={index} className="hover:bg-gray-100 hover:bg-opacity-50 grid grid-cols-1 md:grid-cols-[1fr_4fr] items-center justify-center max-md:gap-4 gap-2 max-md:shadow-lg max-md:p-6 rounded-lg" href={`/dashboard/nps/${item.name.toLowerCase()}`}>
                        <div className="hidden md:flex flex-col gap-2 items-center">
                            <Image
                                className="max-md:hidden w-[60%] aspect-square" 
                                src={item.icon}
                                alt={item.name}
                                width={40}
                                height={40}
                            />
                            <p className="text-[1.5vw] font-medium">{item?.value || "-/-"}</p>
                        </div>
                        <p className="md:hidden font-medium mx-auto text-center">{item?.name}</p>
                        <div className="flex-1">
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
                        </div>
                        <p className="md:hidden text-xs font-medium mx-auto text-center text-orange-400 underline">Recommendations</p>
                    </Link>
                ))}
                </div>
        </div>
    
}

export default SummaryOverview