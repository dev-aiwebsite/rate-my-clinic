
import Image from "next/image"
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { Fragment } from "react";
import Link from "next/link";
import 'primeicons/primeicons.css';

const NavbarDesktop = ({userData}:{userData:any}) => {
    
        let userAvatar = userData?.profile_pic ? `${userData?.profile_pic}-/preview/512x512/-/border_radius/50p/` : "/icons/avatar-default.svg"
        let userName = userData?.username || "Guest"

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
                <PopoverButton className="m-auto outline-none border-none py-1 px-2 rounded-lg hover:bg-white/10">
                            
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
                    <PopoverPanel className="absolute h-fit top-full mt-2 right-0 min-w-40  bg-white py-2 rounded shadow-lg ring-1 ring-gray-200">
                        <ul className="list-none p-0 m-0 text-xs">
                            <li className="hover:bg-gray-100 p-1 px-2">
                                <Link className="w-full block flex flex-row flex-wrap gap-2 items-center" href="/settings/account"><span className="pi pi-cog"></span>Profile settings</Link>
                            </li>
                        </ul>
                    </PopoverPanel>
                    
                </Transition>
            </Popover>    
        </div>
    </div>
    )
}

export default NavbarDesktop