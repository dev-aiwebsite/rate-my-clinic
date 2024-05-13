import { auth } from "@/auth"
import Image from "next/image"
import { Session } from "next-auth"
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Fragment } from "react";
interface CustomSession extends Session {
    user_img: string;
    user_name: string;
}

const Navbar = async () => {
    const session = await auth() as CustomSession
    let userAvatar = session.user_img ? `${session?.user_img}-/preview/512x512/-/border_radius/50p/` : "/icons/avatar-default.svg"
    let userName = session?.user_name || "Guest"
    return(
    <div className="h-16 bg-[#004261] w-full flex flex-row items-center py-6 *:px-6">
        <div className="w-64">
            <Image
            className="h-auto w-24 m-auto"
                src="/images/logos/RMC_Logo-MASTER.png"
                width={60}
                height={60}
                alt="Picture of the author"
            />
        </div>
        <div className="ml-auto flex flex-row items-center justify-center gap-5 w-64">
            <Popover className="relative flex">
                <PopoverButton className="w-5 h-5 m-auto">
                    <Image
                    className=""
                        src="/icons/bell.svg"
                        width={24}
                        height={24}
                        alt="notification"                 
                    />
                </PopoverButton>
                <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
                >
                    <PopoverPanel className="absolute h-fit top-8 right-0 min-w-80  bg-white py-4 rounded shadow-lg ring-1 ring-gray-200">
                        <ul className="list-none p-0 m-0 text-xs">
                            <li className="px-3 py-1">
                                <span>You have <b>4</b> new notifications</span>
                            </li>
                            <li className="p-3">
                                <div className="flex align-items-center">
                                    <Image
                                    className="w-8 h-8 m-auto"
                                        src={`${userAvatar}-/preview/512x512/`}
                                        width={24}
                                        height={24}
                                        alt="Picture of the author"
                                        
                                    />
                                    <div className="flex flex-col ml-3 flex-1">
                                        <div className="flex align-items-center justify-between mb-1">
                                            <span className="font-bold">Jerome Bell</span>
                                            <small>42 mins ago</small>
                                        </div>
                                        <span className="text-xs line-height-3">How to write content about your photographs?</span>
                                    </div>
                                </div>
                            </li>
                            <li className="p-3">
                                <div className="flex align-items-center">
                                    <Image
                                    className="w-8 h-8 m-auto"
                                        src={`${userAvatar}-/preview/512x512/`}
                                        width={24}
                                        height={24}
                                        alt="Picture of the author"
                                        
                                    />
                                    <div className="flex flex-col ml-3 flex-1">
                                        <div className="flex align-items-center justify-between mb-1">
                                            <span className="font-bold">Jerome Bell</span>
                                            <small>42 mins ago</small>
                                        </div>
                                        <span className="text-xs line-height-3">How to write content about your photographs?</span>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </PopoverPanel>
                    
                </Transition>
            </Popover>
            <div className="flex flex-row items-center gap-2">
                <div className="bg-gray-100 rounded-full">
                    <Image
                        className="w-8 h-8 m-auto"
                            src={userAvatar}
                            width={24}
                            height={24}
                            alt="Picture of the author"
                            
                        />
                </div>
                <h2 className="text-white text-sm">{userName}</h2>
            </div>
        </div>
    </div>
    )
}

export default Navbar