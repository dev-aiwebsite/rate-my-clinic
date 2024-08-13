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

    function handleClinicType(){
        const clinic_type_select = document.getElementById('clinic_type') as HTMLFormElement
        const clinic_type_other = document.getElementById('clinic_type_other') as HTMLFormElement

        if(clinic_type_select.value == "other"){
            clinic_type_select.name = ''
            clinic_type_other.name = 'clinic_type'
        } else {
            clinic_type_select.name = 'clinic_type'
            clinic_type_other.name = ''
        }
    }

    

    return (
        <div className="max-md:flex-col flex items-center md:justify-center h-screen w-screen p-10">
                                     <Image 
                                        className="md:hidden w-48 mb-10"
                                        src="/images/logos/rmc-logo.png" 
                                        width={600}
                                        height={600}
                                        alt="rate my clinic signup image"
                                    />
          
            <div className="bg-white rounded-lg shadow-2xl gap-20 ring-1 ring-gray-200 md:w-full max-w-screen-lg md:m-auto">
                {page == 1 &&<div className="overflow-hidden flex flex-col-reverse md:grid md:grid-cols-2 mx-auto p-10 md:p-20 items-center gap-10">
                                <div className="relative z-10">
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
                                        <div className="hidden">
                                            <label className="text-xs text-neutral-400"
                                                htmlFor="userpass">Password</label>
                                            <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                            type="password" name="userpass" id="userpass" defaultValue={userInfo?.userpass || ""} />
                                        </div>
                                        <div>
                                            <label className="text-xs text-neutral-400"
                                                htmlFor="clinic_type">Clinic type</label>

                                            <div className="group ring-1 ring-gray-400 border-none rounded-md *:rounded-md *:px-4 *:py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350">

                                                <select id="clinic_type" name="clinic_type"  className="
                                                group-has-[[value=other]:checked]:absolute block relative z-1 w-full bg-white outline-none border-none"
                                                defaultValue={userInfo?.clinic_type || ""} onChange={handleClinicType} required>
                                                        <option value="physiotherapy">Physiotherapy</option>
                                                        <option value="exercise-physiology">Exercise Physiology</option>
                                                        <option value="chiropractic">Chiropractic</option>
                                                        <option value="podiatry">Podiatry</option>
                                                        <option value="dentistry">Dentistry</option>
                                                        <option value="osteopathy">Osteopathy</option>
                                                        <option value="occupational-therapy">Occupational Therapy</option>
                                                        <option value="speech-therapy">Speech Therapy</option>
                                                        <option value="ndis-provider">NDIS Provider</option>
                                                        <option value="other">Other (please specify)</option>
                                                </select>
                                                <input id="clinic_type_other" name="" className="group-has-[[value=other]:checked]:block hidden relative z-2 w-3/4 bg-white outline-none border-none"
                                                 type="text" placeholder="Please specify"/>
                                            </div>
                                       


                                        </div>
                                        
                                        <button
                                                className="border-none w-full block bg-appblue-300 text-white rounded-md px-4 py-2 hover:shadow-lg cursor-pointer transition-all duration-300 hover:bg-appblue-350"
                                                type="submit" form="signup-form">
                                                Next
                                            </button>
                                            
                                            <div className="flex flex-row justify-between">
                                                <Link className="underline text-xs text-blue-600 text-center mx-auto"
                                                    href="/login">Already a member? Login here
                                                </Link>
                                            </div>
                                        
                                    </form>
                                    
                                </div>
                                <div className="absolute hidden md:block md:relative">
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
                    <div className="relative h-[90vh] p-10">
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
                    </div>
                </>
                }
                        
            </div>
        </div>
    );
}