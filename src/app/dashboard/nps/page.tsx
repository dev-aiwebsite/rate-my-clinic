"use client"
import NpsChart from "@/components/nps-chart";
import { useState } from "react";

export default function Page() {
    const [selected, setSelected] = useState(1)
    function handleSelection(index:number){
        setSelected(index)
    }

    return (<>
        <div className="col-span-3 row-span-1 flex flex-row items-center justify-between card">
            <h1 className="text-2xl">Client NPS: 50</h1>
            <ul className="text-xs flex-1 max-w-md grid gap-[1px] grid-cols-3 divide-x *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
                <li onClick={() => handleSelection(1)} className={selected === 1 ? '!bg-orange-400 text-white' : ''} >Select date</li>
                <li onClick={() => handleSelection(2)} className={selected === 2 ? '!bg-orange-400 text-white' : ''} >dd/mm/yy</li>
                <li onClick={() => handleSelection(3)} className={selected === 3 ? '!bg-orange-400 text-white' : ''} >dd/mm/yy</li>
            </ul>
        </div>

        <div className="col-span-3 row-span-5 h-fit max-md:!pb-30 md:card">
            <NpsChart />
        </div>
    </>
    );
}