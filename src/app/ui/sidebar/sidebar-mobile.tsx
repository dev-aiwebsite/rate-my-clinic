"use client"
import Image from "next/image"
import LogoutBtn from "../../components/logout-btn"
import Link from "next/link"
import { Sidebar } from "primereact/sidebar"
import { GoGear } from "react-icons/go";
import SyncButton from "@/components/sync-btn";
import { useEffect, useState } from "react";

const second_list_item = [
    {
        name: "Nps chart",
        icon: "/icons/nps.svg",
        link: "/dashboard/nps"
    },
    {
        name: "Book a call",
        icon: "/icons/sched.svg",
        link: "/dashboard/contact"
    },
    {
        name: "Settings",
        icon: <GoGear size={20}/>,
        link: "/settings/account"
    }
    
]
const SidebarMobile = ({userData,isVisible = false,position = "right",onHide}:{onHide?:React.Dispatch<React.SetStateAction<boolean>>,userData:any,isVisible?:boolean,position?: "right" | "top" | "bottom" | "left"}) => {
    let userAvatar = userData?.profile_pic ? `${userData?.profile_pic}-/preview/512x512/-/border_radius/50p/` : "/icons/avatar-default.svg"
    let userName = userData?.username || "Guest"

    function handleHide(){
        if(onHide){
            onHide(false)
        }
    }

    
    const customContent = () => {
        return (
           <div className="h-full">
                
            
        <aside className="w-64 h-full bg-white flex flex-col overflow-y-auto">
        {/* <div className=" bg-white text-center border-0 border-b border-gray-200 pb-5 mb-2">
            <Image
            className="h-24 w-auto m-auto p-5"
                src="/images/logos/wrh-logo.png"
                width={600}
                height={600}
                alt="Wrh logo"
                
            />
            <h1 className="mb-2 text-sm">{userData?.user_name}</h1>
            <Link href="/settings/account" className="block !w-fit min-w-1/2 mx-auto ring-1 ring-gray-200 px-6 py-1 rounded-lg text-gray-400 text-xs hover:bg-appblue-200 hover:text-appblue-400">Settings</Link>
        </div> */}
        <ul className="text-gray-500">
                 <li className="pt-6 pb-4 px-6 mb-1 bg-white hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400" >
                    <SyncButton textClass="text-sm text-center block w-full"/>
                </li>
            {second_list_item.map((item, index) => (
                <li key={index} className="mb-1 bg-white hover:bg-appblue-200 rounded-lg hover:text-appblue-400 [&.active]:bg-appblue-200 [&.active]:text-appblue-400" >
                    <a href={item.link} className="flex flex-row items-center gap-3 text-xs py-3 px-6">
                        {typeof(item.icon) === "string" && <Image
                            className="w-5 h-5" 
                            src={item.icon}
                            alt={item.name}
                            width={20}
                            height={20}

                        />}
                        {typeof(item.icon) === "object" && item.icon}
                        {item.name}</a>
                </li>
            ))}
        </ul>
        <div className="mt-auto p-2">
            <LogoutBtn className="text-gray-500 rounded-md text-xs"/>
        </div>
        </aside>
            </div>
        )

    }

    return (<>
       
         <Sidebar maskClassName="!bg-opacity-5 !bottom-0 !top-auto" className="bottom-16 w-fit h-fit rounded-lg overflow-hidden mr-2 mt-auto shadow-lg" onHide={handleHide} visible={isVisible} position={position} content={customContent}>
        
        </Sidebar>
        </>
    )
}

export default SidebarMobile


