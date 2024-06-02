"use client"
import { OwnerSurveyAction, TeamSurveyAction } from "@/server-actions";
import { FormEvent, useState } from "react";
import styles from "./page.module.css";

type page = number
export default function ClientSurveyForm() {
    const searchParams = new URLSearchParams(window.location.search)
    const clinic_id = searchParams.get('cid')
    const clinic_name = searchParams.get('cid')

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

        <>
            <div className="flex-1 p-6 gap-x-6 gap-y-10 max-md:flex max-md:flex-col grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-6">
                <div className="col-span-3 row-span-1 flex flex-row items-center justify-between text-xl font-medium">
                    Client survey
                </div>
                <div className="max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col">
                    <form className="flex-1" id="owner-survey-form" action={TeamSurveyAction} onSubmit={(e) => handleDefaultSubmit(e,page)}>
                        <div className={`flex gap-6 flex-col ${page == 1 ? "" : "!hidden"}`}>
                            {/* <h3 className="text-xl  leading-6 mb-4">Clinic information</h3> */}
                            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3 flex-1">
                                <div className="sm:col-span-1">
                                    <label htmlFor="clinicname" className="formLabel">Clinic name</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input type="hidden" value={`${clinic_name}`}/>
                                            <input
                                                disabled={true}
                                                type="text"
                                                name="clinicname"
                                                id="clinicname"
                                                autoComplete="clinicname"
                                                className=""
                                                placeholder="Clinic" value={`${clinic_name}`}/>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-3 flex-1">
                                <div className="sm:col-span-1">
                                    <label htmlFor="name" className="formLabel">Name</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input
                                                type="text"
                                                name="name"
                                                id="name"
                                                autoComplete="name"
                                                className=""
                                                />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="email" className="formLabel">Email</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                autoComplete="email"
                                                />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>


                        </div>

                        <div className={`flex gap-6 flex-col text-center ${page == 2 ? "" : "!hidden"}`} data-formpage="2">
                            <h3 className="text-xl  leading-6 text-gray-900 mb-4">Page 2</h3>
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