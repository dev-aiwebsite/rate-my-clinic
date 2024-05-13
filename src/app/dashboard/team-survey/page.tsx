import { auth } from "@/auth";
import { fetchData } from "@/lib/data";
export default async function Page() {
    return (
    
        <div className="bg-[#f7f7f7] flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-md *:py-6 *:px-6">
            <div className="col-span-3 row-span-1 flex flex-row items-center justify-between">
               Team survey
            </div>
        </div>
    );
}