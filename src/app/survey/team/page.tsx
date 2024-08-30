"use client"
import InputRange from "../../../components/inputRange";
import { useSessionContext } from "@/context/sessionContext";
import { TeamSurveyAction } from "lib/server-actions";
import { Button } from "primereact/button";
import { Toast, ToastMessage } from 'primereact/toast';
import 'primeicons/primeicons.css';
import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

const selectOptions_0_10 = Array.from({ length: 11 }, (_, i) => i);

type page = number
export default function ClientSurveyForm({searchParams}:{searchParams:any}) {
    const {users} = useSessionContext()
    const toast = useRef<Toast>(null);
    const max_pages = 1
    const [page, setPage] = useState(1)
    const [formSubmitted, setFormSubmitted] = useState(false)
    
    let default_submitBtnText = 'Next'
    if(max_pages == 1){
        default_submitBtnText = 'Submit'
    }
    const [submitBtnText, setSubmitBtnText] = useState(default_submitBtnText)
    const [isLoading, setIsLoading] = useState(false)
  
    const clinic_id = searchParams.cid
    const user_data = users?.find((i: { _id: string; }) => i._id == `${clinic_id}`)
    const clinic_name = user_data?.clinic_name || ""
    const clinic_logo = user_data?.clinic_logo || ""
    console.log(user_data)

    const Alert = ({ severity = 'info', summary = 'Info', detail = 'Message Content' }: ToastMessage) => {
        toast.current?.show({ severity, summary, detail });
    };

    if (!clinic_name) {
        Alert({ severity: 'error', summary: 'Error', detail: 'Clinic not found' });
        return <>
            <Toast className="text-sm" ref={toast} />
            <p className="fixed top-[20vh] left-1/2 -translate-x-1/2">Clinic not found, Please contact your provider</p>
        </>
    }


    function handlePrev(index: page) {
        if (index <= 1) {
            return
        } else {
            setPage(index - 1)
            setSubmitBtnText("Next")
        }
    }

    async function handleDefaultSubmit(e: FormEvent, index: page) {
        e.preventDefault()
        if (index >= max_pages) {
            console.log('submitting')
            setIsLoading(true)
            let form = e.target as HTMLFormElement
            const res = await TeamSurveyAction(new FormData(form))
            if (res.success) {
                form.reset()
                setPage(1)
                setSubmitBtnText("Next")
                // Alert({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully' });
                setIsLoading(false)
                setFormSubmitted(true)
            } else {
                Alert({ severity: 'error', summary: 'Error', detail: res.message });
            }

        } else {
            setPage(index + 1)
            if (page + 1 >= max_pages) {
                setSubmitBtnText("Submit")
            }
        }
    }

    return (

        <>
            <Toast className="text-sm" ref={toast} />
            {formSubmitted && <div className="w-screen h-screen p-10">
                <div className="bg-white p-20 rounded-xl shadow-lg max-w-lg text-center mx-auto mt-28">
                    <p className="pi pi-check-circle text-[10rem] text-green-400"></p>
                    <h1 className="text-2xl font-medium mt-10">Thank you!</h1>
                    <p className="mt-3">Your submission has been sent, you may now safely close this page.</p>
                    


                </div>
            </div>}
            {!formSubmitted && <div className="flex-1 p-1 md:p-6 gap-x-6 gap-y-10 flex flex-col *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-6 max-w-screen-lg mx-auto">
                {/* <div className="col-span-3 row-span-1 flex flex-row items-center justify-between text-2xl font-medium text-appblue-400">
                    Team survey
                </div> */}
                <form className="max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col md:!p-10" id="client_survey_form" onSubmit={(e) => handleDefaultSubmit(e, page)}>
                    <div className="flex-1">
                        <input type="hidden" name="clinicId" value={`${clinic_id}`}/>
                        <div className="flex flex-col items-center mb-10">
                            <Image className="" width="150" height="70" src={clinic_logo} alt={clinic_name} />
                            <h1 className="text-4xl font-medium text-appblue-400 mt-5">Team survey</h1>
                        </div>

                        <div className={`formSectionContainer ${page == 1 ? "" : "!hidden"}`}>
                            {/* <h3 className="text-xl  leading-6 mb-4">Clinic information</h3> */}
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="clinicname" className="formLabel">Clinic name</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input
                                                disabled={true}
                                                type="text"
                                                id="clinicname"
                                                autoComplete="clinicname"
                                                className=""
                                                placeholder="Clinic" value={`${clinic_name}`} />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="fname" className="formLabel">
                                       First name
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input type="text" name="fname" id="fname" required/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="lname" className="formLabel">
                                       Last name
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input type="text" name="lname" id="lname" required/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="email" className="formLabel">
                                       Email
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input type="email" name="email" id="email" required/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="recommendation" className="formLabel">
                                        On a scale of 0-10, how likely are you to recommend <strong>{clinic_name}</strong> as a place to work to your friends and family?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="recommendation" defaultValue={5} required/>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="socialActivities" className="formLabel">
                                        What is your satisfaction with our social activities?
                                    </label>
                                    <div className="mt-2">
                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="socialActivities" defaultValue={5} required/>                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="communication" className="formLabel">
                                        What is your satisfaction with our communication?
                                    </label>
                                    <div className="mt-2">

                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="communication" defaultValue={5} required/>                                            
                                        </div>

                                       
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="professionalDevelopment" className="formLabel">
                                        What is your satisfaction with our Professional Development?
                                    </label>
                                    <div className="mt-2">

                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="professionalDevelopment" defaultValue={5} required/>                                            
                                        </div>

                                      
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="mentoring" className="formLabel">
                                        What is your satisfaction with the level of mentoring you receive?
                                    </label>
                                    <div className="mt-2">

                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="mentoring" defaultValue={5} required/>                                            
                                        </div>

                                      
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="teamWork" className="formLabel">
                                        How well do you believe we work as a team?
                                    </label>
                                    <div className="mt-2">

                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={100} name="teamWork" defaultValue={5} required/>                                            
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="improvements" className="formLabel">
                                        As a workplace, what would you like to see more or less of to make us a more enjoyable, challenging and rewarding place to work?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <textarea id="improvements" name="improvements" placeholder="Your suggestions..." required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="strengths" className="formLabel">
                                        What do you believe are the strengths of our clinic?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <textarea id="strengths" name="strengths" placeholder="Strengths..." required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="communicationRating" className="formLabel">
                                        How well do you believe we communicate?
                                    </label>
                                    <div className="mt-2">

                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={100} name="communicationRating" defaultValue={5} required/>                                            
                                        </div>

                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="needsImprovement" className="formLabel">
                                        What do you believe we need to improve?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <textarea id="needsImprovement" name="needsImprovement" placeholder="Areas for improvement..." required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="rewardComparison" className="formLabel">
                                        How well do you believe you are rewarded compared to your peers?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <select id="rewardComparison" name="rewardComparison" required>
                                                <option value="considerably_worse">Considerably worse</option>
                                                <option value="somewhat_worse">Somewhat worse</option>
                                                <option value="about_the_same">About the same</option>
                                                <option value="somewhat_better">Somewhat better</option>
                                                <option value="considerably_better">Considerably better</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="serviceKnowledge" className="formLabel">
                                        How would you rate your knowledge of the services we provide?
                                    </label>
                                    <div className="mt-2">

                                         <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={100} name="serviceKnowledge" defaultValue={5} required/>                                            
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="additionalComments" className="formLabel">
                                        Is there anything else you would like to add?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <textarea id="additionalComments" name="additionalComments" placeholder="Additional comments..." required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>


                        <div className={`formSectionContainer ${page == 2 ? "" : "!hidden"}`} data-formpage="2">
                            <h3 className="text-xl  leading-6 text-gray-900 mb-4">Page 2</h3>
                        </div>
                    </div>
                    <div className="w-full flex flex-row justify-end items-end mt-10">
                        <button className={`btn ${page != 1 ? "" : "!hidden"}`} onClick={() => handlePrev(page)} type="button">Back</button>
                        <Button className="md:h-14 btn-primary min-w-60" type="submit" label={submitBtnText} icon="pi pi-check" loading={isLoading} />
                    </div>
                </form>
            </div>}
          
        </>
    );
}