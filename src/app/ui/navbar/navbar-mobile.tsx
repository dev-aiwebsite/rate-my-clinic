"use client"

import Image from "next/image"
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Fragment, useState } from "react";
import Link from "next/link";
import SidebarMobile from "../sidebar/sidebar-mobile";
import 'primeicons/primeicons.css';
const list_item = [
    {
        name: "Owner survey",
        icon: "/icons/checklist.svg",
        link: "/dashboard/owner-survey"
    },
    {
        name: "Team survey",
        icon: "/icons/team.svg",
        link: "/dashboard/team-survey"
    },
    {
        name: "My clinic",
        icon: "/icons/home.svg",
        link: "/dashboard"
    },
    {
        name: "Client survey",
        icon: "/icons/client.svg",
        link: "/dashboard/client-survey"
    },
]

const NavbarMobile = ({ userData }: { userData: any }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);
console.log(userData)
    function toggleSidebar() {
        setIsSidebarVisible(!isSidebarVisible)
    }
    let userAvatar = userData?.img ? `${userData?.img}-/preview/512x512/-/border_radius/50p/` : "/icons/avatar-default.svg"
    let userName = userData?.username || "Guest"

    return (
        <div className="bg-white h-fit fixed bottom-0 left-0 w-full z-[1100]">
            <ul className="h-14 flex flex-row items-center justify-between *:flex-1 items-center justify-center text-neutral-400">
                <li>
                    <Link href={list_item[0].link} className="flex flex-col items-center gap-1 text-[8px] whitespace-nowrap">
                        <Image
                            className="w-5 h-5"
                            src={list_item[0].icon}
                            alt={list_item[0].name}
                            width={20}
                            height={20}
                        />
                        {list_item[0].name}</Link>
                </li>

                <li>
                    <Link href={list_item[1].link} className="flex flex-col items-center gap-1 text-[8px] whitespace-nowrap">
                        <Image
                            className="w-5 h-5"
                            src={list_item[1].icon}
                            alt={list_item[1].name}
                            width={20}
                            height={20}
                        />
                        {list_item[1].name}</Link>
                </li>
                <li>
                    <Link href={list_item[2].link}
            
                    className="flex flex-col items-center gap-1 text-[8px] whitespace-nowrap
                    bg-gradient-to-b from-[#94BDE5] to-[#52697F] ring-1 ring-gray-300 rounded-full aspect-square items-center justify-center
                    text-white text-xs ring-offset-4
                    -translate-y-1/2 hover:ring-appblue-350
                    transition-all duration-300 hover:bg-gradient-to-l max-w-20 mx-auto
                    ">
                        <Image
                            className="w-5 h-5 hidden"
                            src={list_item[2].icon}
                            alt={list_item[2].name}
                            width={20}
                            height={20}
                        />
                        {list_item[2].name}</Link>
                </li>
                <li>
                    
                    <Link href={list_item[3].link} className="flex flex-col items-center gap-1 text-[8px] whitespace-nowrap">
                        <Image
                            className="w-5 h-5"
                            src={list_item[3].icon}
                            alt={list_item[3].name}
                            width={20}
                            height={20}
                        />
                        {list_item[3].name}</Link>
                </li>

                <li>
                    <span onClick={toggleSidebar} className="flex flex-col items-center gap-1 text-[8px] whitespace-nowrap">
                       <i className="pi pi-ellipsis-h text-lg"></i>
                        Menu
                    </span>
                </li>
            </ul>
            <SidebarMobile userData={userData} isVisible={isSidebarVisible} />
        </div>
    )
}

export default NavbarMobile