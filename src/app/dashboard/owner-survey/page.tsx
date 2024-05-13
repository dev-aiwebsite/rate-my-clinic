"use client"
import { OwnerSurveyAction } from "@/server-actions";
import { FormEvent, useState } from "react";


type page = number
export default function Page() {
    const max_pages = 2
    const [page,setPage] = useState(1)
    const [submitBtnText, setSubmitBtnText] = useState("Next")

    function handlePrev(index:page) {
        if(index <= 1){
            return
        } else {
            setPage(index - 1)
            setSubmitBtnText("Next")
            
        }
    }

    function handleDefaultSubmit(e:FormEvent,index:page){   
        if(index >= max_pages){
            console.log('submitting')
            return
        } else {
            e.preventDefault()
            setPage(index + 1)
            if(page + 1 >= max_pages){
                setSubmitBtnText("Submit")
            } 
        }
    }

    return (

        <><div className="bg-[#f7f7f7] flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-md *:py-6 *:px-6">
            <div className="col-span-3 row-span-1 flex flex-row items-center justify-between">
                Owner survey
            </div>
            <div className="col-span-3 row-start-2 row-span-full flex flex-col">
                <form className="flex-1" id="owner-survey-form" action={OwnerSurveyAction} onSubmit={(e) => handleDefaultSubmit(e,page)}>
                    <div className={`flex gap-6 flex-col ${page == 1 ? "" : "!hidden"}`}>
                        <h3 className="text-xl  leading-6 text-gray-900 mb-4">Clinic information</h3>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3 flex-1">
                            <div className="sm:col-span-1">
                                <label htmlFor="clinicname" className="block text-xs leading-6 text-gray-400">Clinic name</label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            required
                                            type="text"
                                            name="clinicname"
                                            id="clinicname"
                                            autoComplete="clinicname"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="My Clinic" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3 flex-1">
                            <div className="sm:col-span-1">
                                <label htmlFor="firstname" className="block text-xs leading-6 text-gray-400">First name</label>
                                <div className="">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            type="text"
                                            name="firstname"
                                            id="firstname"
                                            autoComplete="firstname"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="John" />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="lastname" className="block text-xs leading-6 text-gray-400">Last name</label>
                                <div className="">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            type="text"
                                            name="lastname"
                                            id="lastname"
                                            autoComplete="lastname"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="Doe" />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="email" className="block text-xs leading-6 text-gray-400">Email</label>
                                <div className="">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            type="email"
                                            name="email"
                                            id="email"
                                            autoComplete="email"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="johndoe@gmail.com" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3 flex-1">
                            <div className="sm:col-span-1">
                                <label htmlFor="streetaddress" className="block text-xs leading-6 text-gray-400">Street address</label>
                                <div className="">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            type="text"
                                            name="streetaddress"
                                            id="streetaddress"
                                            autoComplete="streetaddress"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="10/162 Golden Valley Drive" />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="address2" className="block text-xs leading-6 text-gray-400">Address 2</label>
                                <div className="">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            type="text"
                                            name="address2"
                                            id="address2"
                                            autoComplete="address2"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="Doe" />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-1">
                                <label htmlFor="city" className="block text-xs leading-6 text-gray-400">City name</label>
                                <div className="">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                        <input
                                            type="text"
                                            name="city"
                                            id="city"
                                            autoComplete="city"
                                            className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                            placeholder="Glossodia" />
                                    </div>
                                </div>
                            </div>
                            <div className="sm:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                                <div className="sm:col-span-1">
                                    <label htmlFor="state" className="block text-xs leading-6 text-gray-400">State</label>
                                    <div className="">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                            <input
                                                type="text"
                                                name="state"
                                                id="state"
                                                autoComplete="state"
                                                className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                                placeholder="NSW" />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="postal" className="block text-xs leading-6 text-gray-400">Post code</label>
                                    <div className="">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 sm:max-w-md px-2  focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                            <input
                                                type="text"
                                                name="postal"
                                                id="postal"
                                                autoComplete="postal"
                                                className="block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                                placeholder="2756" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <div className={`flex gap-6 flex-col text-center ${page == 2 ? "" : "!hidden"}`} data-formpage="2">
                        <h3 className="text-xl  leading-6 text-gray-900 mb-4">How many clinics do you have?</h3>

                        <div className="w-full">
                            <div className="w-full">
                                <label htmlFor="clinicaddresses" className="block text-xs leading-6 text-gray-400">Please share clinic addresses (optional)</label>
                                <div className="mt-2 w-full">
                                    <div className="mx-auto sm:max-w-lg flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 px-2 focus-within:ring-2 focus-within:ring-inset focus-within:ring-appblue-300 ">
                                     <textarea
                                      className="w-full min-h-[30vh] block text-sm flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 ring-0 focus:ring-0 outline-none sm:text-sm sm:leading-6"
                                      name="clinicaddresses" id="clinicaddresses">

                                     </textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="w-full flex flex-row justify-end items-end">
                    <button className={`btn ${page != 1 ? "" : "!hidden"}`} onClick={() => handlePrev(page)} type="button">Back</button>
                    <button className="btn-primary min-w-60" type="submit" form="owner-survey-form">{submitBtnText}</button>
                </div>
            </div>
        </div>
        </>
    );
}