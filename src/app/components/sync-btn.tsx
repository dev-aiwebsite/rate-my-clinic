"use client";
import Image from "next/image";
import { Button } from "primereact/button";
import { useCallback, useEffect, useState } from "react";
import 'primeicons/primeicons.css';
import { getSurveyData } from "@/server-actions";
import { formatDistanceToNow } from "date-fns";
import { useSurveyDataContext } from "@/context/surveyDataContext";

export default function SyncButton({buttonClass,textClass}:{buttonClass?:string,textClass?:string}) {
    const [isLoading, setIsLoading] = useState(false);
    const [lastSync, setLastSync] = useState(new Date());
    const { data, setData } = useSurveyDataContext();
    const [textTime, setTextTime] = useState(formatDistanceToNow(lastSync, { addSuffix: true }));

    const handleClick = () => {
        setIsLoading(true);
        getSurveyData().then(d => {
            setData(d);
            setIsLoading(false);
            setLastSync(new Date());
            setTextTime(formatDistanceToNow(lastSync, { addSuffix: true }))
        });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setTextTime(formatDistanceToNow(lastSync, { addSuffix: true }));
        }, 5000);

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, [lastSync]);

    return (
        <>
            <Button
                className={`${buttonClass} w-full flex flex-row gap-4 justify-center items-center min-w-20 justify-center gap-2 !text-center ring-0 border-0 py-1 px-4 rounded bg-orange-400 cursor-pointer hover:bg-orange-500 text-white`}
                disabled={isLoading}
                onClick={handleClick}
            >
                <span className={`${isLoading ? 'pi-spin' : ""} pi pi-sync text-sm`}></span>
                {isLoading ? 'Syncing...' : 'Sync now'}
            </Button>
            <span className={`${textClass} text-xs text-slate-400`}>Last sync: {textTime}</span>
        </>
    );
}
