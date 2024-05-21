import Image from "next/image";
import CircleChart from "./circle-chart"
import MeterChart from "./meter-chart";
import Link from "next/link";

const data = [
    {
        name: 'Clients',
        value: 73,
        color: 'var(--appgreen-300)',
        icon: '/icons/client.svg',
    },
    {
        name: 'Strategy',
        value: 25,
        color: 'var(--appgreen-300)',
        icon: '/icons/strategy.svg',
    },
    {
        name: 'Team',
        value: 58,
        color: 'var(--appblue-200)',
        icon: '/icons/team.svg',
    },
    {
        name: 'Finance',
        value: 49,
        color: 'var(--appblue-200)',
        icon: '/icons/finance.svg',
    },
]

let test = [
    {
        name: 'Group A',
        value: 20,
        color: '#94BDE5',
    },
    {
        name: 'Group B',
        value: 50,
        color: '#004261',
    }
]

let needle = {
    color: "#004261",
    value: 90,
    title: 'Client'
}


 const SummaryOverview = ({additionalClass = ""}) => {
    let cName = `${additionalClass} row-span-3 col-span-3 grid grid-cols-3`
    return <div className={cName}>
            <div className="flex flex-col items-center justify-center gap-5 border-0 border-solid border-r border-gray-200">
                <CircleChart data={test}/>
                <div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="h-3 w-3 bg-appblue-300"></div>
                        <span className="text-lg">Overall Rating: -/-</span>
                    </div>
                    <div className="flex flex-row gap-2 items-center">
                        <div className="h-3 w-3 bg-appblue-400"></div>
                        <span className="text-xs">Average Australian Clinic: {test[0].value}</span>
                    </div>
                </div>
                <a className="font-medium text-gray-400" href="#">See full report</a>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-6">
               {data.map((item, index) => (
                <div key={index} className="grid grid-cols-[1fr_4fr] items-center justify-center gap-4">
                    <div className="flex flex-col gap-2 items-center">
                        <Image
                            className="w-[60%] aspect-square" 
                            src={item.icon}
                            alt={item.name}
                            width={40}
                            height={40}
                        />
                        <p className="text-[1.5vw] font-medium">{item?.value || "-/-"}</p>
                    </div>
                    <div className="flex-1">
                        <Link href={`/dashboard/nps/${item.name.toLowerCase()}`}>
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
                        </Link>
                    </div>
                </div>
               ))}
            </div>
        </div>
    
}

export default SummaryOverview