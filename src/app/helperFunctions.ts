"use client"
import { redirect, usePathname } from "next/navigation";


export function IsProfileComplete({currentUser}:{currentUser:any}) {
    const pathname = usePathname();
    console.log(currentUser, 'from isProfileComplete')
    
}

export function formatDateTime(date:Date){
    date = new Date(date)

    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    });

    return formattedDate

}