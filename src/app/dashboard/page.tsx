import { auth } from "@/auth";
import SummaryOverview from "@/components/summary-overview";
import SyncButton from "@/components/sync-btn";
import { ExtendedAdapterSession } from "../../../typings";
import HelperCard from "@/components/helperCard";
import Link from "next/link";
import CircleChart from "@/components/circle-chart";
import Image from "next/image";
import { fetchData } from "@/lib/data";

let NpsTest = [
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
export default async function Page() {
    const session = await auth() as unknown as ExtendedAdapterSession
    console.log('from dashboard')
    let userName = session?.user_name || "Guest"
    return (

        <div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 max-md:flex max-md:flex-row max-md:flex-wrap md:grid md:grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-md *:py-6 *:px-6">
            <div className="hidden col-span-3 row-span-1 md:flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl inline-block mr-2 capitalize">{userName}</h1>
                    <span className="text-gray-400 text-base">You have 09:30:00 days till your final report is generated</span>
                </div>
                <SyncButton/>
            </div>

            <SummaryOverview additionalClass="max-md:basis-full !px-0 md:*:px-6 gap-6"/>

            <div className="md:row-span-2 max-md:basis-full">
                <Link className="flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps/strategy">
                    <div>
                        <p>Client NPS</p>
                        <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                    </div>
                    <CircleChart data={NpsTest}/>
                </Link>
            </div>

            <div className="md:row-span-2 max-md:basis-full">
                <Link className="flex flex-wrap flex-row items-center justify-around" href="/dashboard/nps/strategy">
                    <div>
                        <p>Team NPS</p>
                        <p className="font-medium underline text-orange-400 hover:text-orange-500">View Chart</p>
                    </div>
                    <CircleChart data={NpsTest}/>
                </Link>
            </div>
            <div className="md:row-span-2 !p-0 max-md:basis-full">
                <HelperCard className="!ring-0"/>
            </div>

            
        </div>
    );
}