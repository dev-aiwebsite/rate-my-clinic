"use client"
import { redirect, usePathname } from "next/navigation";


export function IsProfileComplete({currentUser}:{currentUser:any}) {
    const pathname = usePathname();
    console.log(currentUser, 'from isProfileComplete')
    
}