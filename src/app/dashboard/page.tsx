import { auth } from "@/auth";
import SummaryOverview from "@/components/summary-overview";
import SyncButton from "@/components/sync-btn";
import { ExtendedAdapterSession } from "../../../typings";
import HelperCard from "@/components/helperCard";
export default async function Page() {
    const session = await auth() as unknown as ExtendedAdapterSession
    let userAvatar = session?.user_img ? `${session?.user_img}-/preview/512x512/-/border_radius/50p/` : "/icons/avatar-default.svg"
    let userName = session?.user_name || "Guest"
    return (
    
        <div className="bg-[#f7f7f7] flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-md *:py-6 *:px-6">
            <div className="col-span-3 row-span-1 flex flex-row items-center justify-between">
                <div>
                    <h1 className="text-2xl inline-block mr-2 capitalize">{userName}</h1>
                    <span className="text-gray-400 text-base">You have 09:30:00 days till your final report is generated</span>
                </div>
                <SyncButton/>
            </div>

            <SummaryOverview additionalClass="!px-0 *:px-6 gap-6"/>

            <div className="row-span-2">

            </div>
            <div className="row-span-2">

            </div>
            <div className="row-span-2 !p-0">
                <HelperCard className="!ring-0"/>
            </div>

            
        </div>
    );
}