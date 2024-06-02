import { auth } from "@/auth";
import ProfileUploadBtn from "@/components/upload-profile-btn";
import { UpdateUser } from "@/server-actions";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
const ProfileUploadBtnNoSSR = dynamic(() => import("@/components/upload-profile-btn"), { ssr: false });
export default async function AccountPage() {
    const session = await auth()
    return (
        <div className="bg-[#f7f7f7] grid-flow-* flex-1 p-6 gap-x-6 gap-y-10 grid max-md:grid-cols-4 md:grid-rows-6 *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-6">
            <div className="col-span-2 md:col-span-1 md:row-span-2 text-center">
                <h3 className="">Clinic Logo</h3>
                <Image
                className="h-24 w-auto m-auto p-5"
                    src="/images/logos/wrh-logo.png"
                    width={600}
                    height={600}
                    alt="Wrh logo"
                />
            </div>
            <div className="col-span-2 md:col-span-1 md:col-start-1 md:row-span-2 flex">
                <div className="flex items-center flex-col justify-between flex-1">
                    <h3 className="text-center">Membership</h3>
                    <p className="text-xl text-center">Basic</p>
                    <div className="flex flex-col items-center gap-2">
                        <Link href="#" className="text-xs font-medium text-orange-400 underline">Upgrade</Link>
                        <Link href="#" className="text-xs font-medium text-gray-400">Cancel subscription</Link>
                    </div>
                </div>
            </div>
            <div className="col-span-2 md:col-span-1 md:row-span-2 text-center">
                <h3>Invoices</h3>
                <ul>
                    <li>
                        <Link href="#" className="flex">
                            <span className="underline text-xs text-blue-600">26/03/24</span>
                            <span className="block border-dashed border border-gray-400 h-px flex-1 my-auto mx-4"></span>
                            <span className="underline text-xs text-blue-600">$19.99</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex">
                            <span className="underline text-xs text-blue-600">26/03/24</span>
                            <span className="block border-dashed border border-gray-400 h-px flex-1 my-auto mx-4"></span>
                            <span className="underline text-xs text-blue-600">$19.99</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="#" className="flex">
                            <span className="underline text-xs text-blue-600">26/03/24</span>
                            <span className="block border-dashed border border-gray-400 h-px flex-1 my-auto mx-4"></span>
                            <span className="underline text-xs text-blue-600">$19.99</span>
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="max-md:col-span-full md:col-span-2 md:row-start-1 md:col-start-2 row-span-6">
             <ProfileUploadBtnNoSSR userSession={session}/>

            </div>

        </div>
    );
}