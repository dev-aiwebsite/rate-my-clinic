"use client"
import InputRange from "@/components/inputRange";
import { useUsersContext } from "@/context/usersContext";
import { TeamSurveyAction } from "@/server-actions";
import { Button } from "primereact/button";
import { Toast, ToastMessage } from 'primereact/toast';
import { FormEvent, useEffect, useRef, useState } from "react";

const selectOptions_0_10 = Array.from({ length: 11 }, (_, i) => i);

type page = number
export default function ClientSurveyForm() {
    const users = useUsersContext()
    const toast = useRef<Toast>(null);
    const max_pages = 1
    const [page, setPage] = useState(1)
    const [submitBtnText, setSubmitBtnText] = useState("Next")
    const [isLoading, setIsLoading] = useState(false)
    const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);

    console.log('rendering')
    useEffect(() => {
        if (typeof window !== "undefined") {
            setSearchParams(new URLSearchParams(window.location.search));
        }

        if(max_pages == 1){
            setSubmitBtnText('Submit')
        }
    }, []);


   

    const clinic_id = searchParams?.get('cid')
    const clinic_name = users?.find(i => i._id == `${clinic_id}`)?.clinic_name || ""



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
                Alert({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully' });
                setIsLoading(false)
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
            <div className="flex-1 p-6 gap-x-6 gap-y-10 flex flex-col *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-6 max-w-screen-lg mx-auto">
                <div className="col-span-3 row-span-1 flex flex-row items-center justify-between text-xl font-medium">
                    Team survey
                </div>
                <form className="max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col !p-10" id="client_survey_form" onSubmit={(e) => handleDefaultSubmit(e, page)}>
                    <div className="flex-1">
                        <input type="hidden" name="clinicId" value={`${clinic_id}`}/>

                        <div className={`formSectionContainer ${page == 1 ? "" : "!hidden"}`}>
                            {/* <h3 className="text-xl  leading-6 mb-4">Clinic information</h3> */}
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="name" className="formLabel">
                                       Name
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input type="text" name="name" id="name" required/>
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
                                            <InputRange min={0} max={10} name="recommendation" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={10} name="socialActivities" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={10} name="communication" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={10} name="professionalDevelopment" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={10} name="mentoring" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={100} name="teamWork" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={100} name="communicationRating" defaultValue={0} required/>                                            
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
                                            <InputRange min={0} max={100} name="serviceKnowledge" defaultValue={0} required/>                                            
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
            </div>
        </>
    );
}