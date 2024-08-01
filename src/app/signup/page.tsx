"use client"
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useSessionContext } from "@/context/sessionContext";
import { IoIosArrowRoundBack } from "react-icons/io";
import { ProductCards } from "components/product-cards";

export default function SignupPage({children}:any) {
    interface UserInfo {
        [key: string]: string;
      }
    const max_page = 2
    const [page, setPage] = useState(1)
    const [userInfo,setUserInfo] = useState<UserInfo | null>(null)
    const [emailExist,setEmailExist] = useState(false)
   
    const {users} = useSessionContext()
    function handlePrev(){
        if(page <= 1) return
        setPage(page - 1)
    }
    function handleNext(){
        if(page >= max_page) return
        setPage(page + 1)
    }

    
    function handleSubmit(e:FormEvent){
        e.preventDefault()
        
        let fd = new FormData(e.target as HTMLFormElement)
        let userInfo:UserInfo = {}
        
        fd.forEach((v, k) => {
            if (typeof v === "string") {
                userInfo[k] = v;
            } else if (v instanceof File) {
                // Handle the case when v is a File object
                // You can store the file in a different way or convert it to a string
            }
        });
        let emailExist = users.find((i: { useremail: string | any[]; }) => i.useremail == userInfo.useremail)
        if(emailExist){

            setEmailExist(true)
            return
        }
        setUserInfo(userInfo)
        handleNext()
    }

    

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="bg-white rounded-lg shadow-2xl gap-20 ring-1 ring-gray-200 w-full h-[90vh] max-w-screen-lg m-auto">
                <div className="relative h-full">                   
                    <div className="h-full p-10">
                        {page == 1 &&<div className="grid md:grid-cols-2 mx-auto p-10 md:p-10 !pb-0">
                            <div className="">
                                <h1 className="text-lg font-bold text-center mb-10">Enter User Details</h1>
                                <form id="signup-form" onSubmit={(e) => {handleSubmit(e)}} className="flex flex-col gap-6">
                                    <div className="grid md:grid-cols-2 gap-5">
                                        <div>
                                            <label className="text-xs text-neutral-400"
                                                htmlFor="fname">First name</label>
                                            <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                            type="text" name="fname" id="fname" defaultValue={userInfo?.fname || ""} required/>
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400"
                                                htmlFor="lname">Last name</label>
                                            <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                            type="text" name="lname" id="lname" defaultValue={userInfo?.lname || ""}  required/>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-400"
                                            htmlFor="useremail">Email Address</label>
                                            {emailExist && <p className="rounded bg-red-200 bg-opacity-50 ring-red-400 px-4 py-2 text-red-500 text-xs">* Email already exist</p>}
                                        <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                        type="email" name="useremail" id="useremail" defaultValue={userInfo?.useremail || ""}  required/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-400"
                                            htmlFor="userpass">Password</label>
                                        <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                        type="password" name="userpass" id="userpass" defaultValue={userInfo?.userpass || ""}  required/>
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-400"
                                            htmlFor="clinic_type">Clinic type</label>
                                    <select id="clinic_type" name="clinic_type"  className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                    defaultValue={userInfo?.clinic_type || ""} required>
                                            <option value="GP">General Practitioner (GP) Clinic</option>
                                            <option value="Dental">Dental Clinic</option>
                                            <option value="Community">Community Health Clinic</option>
                                            <option value="Mental">Mental Health Clinic</option>
                                            <option value="Specialist">Specialist Clinic</option>
                                    </select>
                                    </div>
                                </form>
                            </div>
                            <div className="">
                                <Image 
                                    className="h-full w-full"
                                    src="/images/logos/signup-optmz.png" 
                                    width={600}
                                    height={600}
                                    alt="rate my clinic signup image"
                                />
                            </div>
                        </div>
                        }
                        {page == 2 && <>
                            <div className="h-full overflow-y-scroll">
                                <div>
                                    <button type="button" className="absolute top-5 left-5 rounded-lg bg-transparent hover:bg-gray-100 p-2" onClick={handlePrev}>
                                    <IoIosArrowRoundBack size={24} />
                                    </button>
                                    <h1 className="mx-auto text-lg font-bold text-center mb-10">Select Plan</h1>
                                </div>
                          
                                {userInfo && <div className="p-10 [&_>_*_>_*:nth-child(-n+2)]:col-span-3">
                                        <ProductCards metadata={userInfo}/>
                                    </div>}
                            </div>
                        </>}
                        {page == 1 && <div className="md:grid-cols-2 grid px-10 md:px-20">
                            <div className="mx-auto w-full">  
                                {page == 1 && <button
                                    className="border-none w-full block bg-appblue-300 text-white rounded-md px-4 py-2 hover:shadow-lg cursor-pointer transition-all duration-300 hover:bg-appblue-350"
                                    type="submit" form="signup-form">
                                    Next
                                </button>}
                                
                                <div className="flex flex-row justify-between">
                                    <Link className="underline text-xs text-blue-600 text-center mx-auto"
                                        href="/login">Already a member? Login here
                                    </Link>
                                </div>
                            </div>
                             <div></div>
                        </div>
                        }
                    </div>
                </div>
            </div>


        </div>
    );
}