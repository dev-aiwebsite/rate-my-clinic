"use client"
import MembershipDetails from "components/membership-details";
import ProfileForm from "../../../../components/profiledetails-form";
import { useSessionContext } from "@/context/sessionContext";
import Image from "next/image";
import { useEffect, useState } from "react";
import { isProfileCompleteCheckList, mobileNavbarHeight } from "lib/Const";
import { useRouter } from "next/navigation";

export default function AccountPage({searchParams}:{searchParams?:any}) {
    const router = useRouter();
    const {currentUser} = useSessionContext()
    let tocheck = isProfileCompleteCheckList
    const [isProfileComplete, setIsprofileComplete] = useState(false)
    let defaultisJourney = searchParams.journey == "" ? true : false
    const [isJourney,setIsJourney] = useState(defaultisJourney);

    useEffect(()=>{
        const isComplete = tocheck.every(i => currentUser[i])
        setIsprofileComplete(isComplete)
    },[])
    // const isProfileComplete = false

    const handleAfterSubmit = () => {
        router.push('/dashboard/owner-survey?journey');
      };

    function exitJourney(){
        router.replace('/dashboard/settings/account')
        setIsJourney(false)
    }
 
    return (
        <>
        <div className="grid-flow-* flex-1 p-6 gap-x-6 gap-y-10 grid max-md:grid-cols-4 md:grid-cols-3 md:grid-rows-6 max-md:pb-40" >
            <div className="card col-span-2 md:col-span-1 md:row-span-2 text-center">
                <h3 className="">Clinic Logo</h3>
                <Image
                className="h-24 md:h-40 w-auto m-auto p-5"
                    src={currentUser?.clinic_logo || "/images/logos/default_logo.svg"}
                    width={600}
                    height={600}
                    alt=""
                />
            </div>
            <div className="card col-span-2 md:col-span-1 md:col-start-1 md:row-span-2 flex">
                <MembershipDetails sessionId={currentUser.last_checkout_session_id as string}/>
            </div>
            {/* <div className="card col-span-2 md:col-span-1 md:row-span-2 text-center">
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
            </div> */}
           
                {!isProfileComplete || isJourney ? (<div className={`max-md:flex-col-reverse setupWrapper bg-black/50 left-0 top-0 fixed h-[calc(100vh_-_${mobileNavbarHeight})] md:h-screen setupWrapper w-screen z-10 p-10 flex gap-4`}>
                        <div className="w-96 flex flex-col flex-nowrap -mb-10">
                            <div className="mt-auto relative bg-white w-fit rounded-2xl p-5 mx-auto space-y-4 after:content-[''] after:bg-red after:w-0 after:h-0 after:absolute after:border-solid after:border-[15px] after:border-transparent after:border-t-white after:top-full ">
                            {isProfileComplete && <button className="absolute right-4 group" onClick={exitJourney}><span className="pi pi-times flex items-center justify-center text-lg text-gray-600 transform transition-transform duration-300 hover:scale-110 hover:text-red-400"></span></button>}
                                <h1 className="inline-block text-lg font-bold">Welcome {currentUser.fname},</h1>
                                
                                <p className="text-md text-gray-700">{`To make the App work, let's continue setting up your details.`}</p>
                            </div>
                            <Image
                                className="w-32 md:w-36 aspect-square" 
                                src="/images/logos/helper_avatar.png"
                                alt="recommendation avatar"
                                width={150}
                                height={150}
                            />
                        </div>
                        <div className="card w-full max-md:overflow-hidden">
                             <ProfileForm redirectTo="/dashboard/owner-survey?journey"/>
                        </div>
                        </div>) : (
                             <div className="card max-md:col-span-full md:col-span-2 md:row-start-1 md:col-start-2 row-span-6 z-[20]">
                                <ProfileForm/>
                                </div>
                                )
                }
                
           

        </div>
        </>
    );
}