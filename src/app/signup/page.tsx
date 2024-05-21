"use client"
import PaymentEmbed from "@/components/paymentEmbed";
import { RegisterUser } from "@/server-actions";
import { products } from "@/stripe_products";
import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";

import CheckmarkDemo from "../components/pricing-plan-dropdown";
import BasicDemo from "../components/pricing-plan-dropdown";
import SelectPlan from "../components/pricing-plan-dropdown";
export default function SignupPage({children}:any) {
    const max_page = 2
    const [page, setPage] = useState(1)
   
    function handlePrev(){
        if(page <= 1) return
        setPage(page - 1)
    }
    function handleNext(){
        if(page >= max_page) return
        setPage(page + 1)
    }
    async function submitForm(e:FormEvent){
        e.preventDefault()
        // const formData = new FormData(e.target as HTMLFormElement)
        // let res = await RegisterUser(formData)
        // console.log(res)
    }

    return (
        <div className="flex items-center justify-center h-screen w-screen">

            <div className="bg-white rounded-lg shadow-2xl p-20 gap-20 ring-1 ring-gray-200 w-full h-[90vh] max-w-screen-lg m-auto">
                <div className="relative h-full">
                    <div className="grid grid-cols-2 mx-auto">
                        <div>
                            {page == 1 && <>
                            <h1 className="text-lg font-bold text-center font-medium mb-10">Enter User Details</h1>
                            <form id="signup-form" onSubmit={(e) => {submitForm(e)}} className="flex flex-col gap-6">
                                <div>
                                    <label className="text-xs text-neutral-400"
                                        htmlFor="username">Name</label>
                                    <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                    type="text" name="username" id="username" required/>
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-400"
                                        htmlFor="useremail">Email Address</label>
                                    <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                    type="email" name="useremail" id="useremail"required/>
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-400"
                                        htmlFor="userpass">Password</label>
                                    <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                    type="password" name="userpass" id="userpass"required/>
                                </div>
                                <div>
                                    <label className="text-xs text-neutral-400"
                                        htmlFor="clinic_type">Clinic type</label>
                                <select id="clinic_type" name="clinic_type"  className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                                required>
                                        <option value="GP">General Practitioner (GP) Clinic</option>
                                        <option value="Dental">Dental Clinic</option>
                                        <option value="Community">Community Health Clinic</option>
                                        <option value="Mental">Mental Health Clinic</option>
                                        <option value="Specialist">Specialist Clinic</option>
                                </select>
                                </div>
                            </form>
                            </>}
                            {page == 2 && <>
                                
                                <SelectPlan />
                            </>}
                            <div className="">  
                                <div>
                                    <button
                                        onClick={page == 1 ? handleNext : handlePrev}
                                        className="border-none w-full block bg-appblue-300 text-white rounded-md px-4 py-2 hover:shadow-lg cursor-pointer transition-all duration-300 hover:bg-appblue-350"
                                        type="submit" form="signup-form">
                                        {page == 1 ? "Next" : "Back"}
                                    </button>
                                    <div className="flex flex-row justify-between">
                                        <Link className="underline text-xs text-blue-600 text-center mx-auto"
                                            href="/login">Already a member? Login here
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {page == 1 && <>
                        <div>
                            <Image 
                                className="h-full w-full"
                                src="/images/logos/signup-optmz.png" 
                                width={600}
                                height={600}
                                alt="rate my clinic signup image"
                            />
                        </div>
                        </>}
                        {page == 2 &&
                        <div className="">
                        <PaymentEmbed priceId={products.basic.id}/>
                            <div>
                                test
                            </div>
                        </div>
                        }
                    </div>
                </div>
            </div>


        </div>
    );
}