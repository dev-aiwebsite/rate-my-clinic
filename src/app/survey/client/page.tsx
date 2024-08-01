"use client"
import InputRange from "../../../components/inputRange";
import { useSessionContext } from "@/context/sessionContext";
import { ClientSurveyAction, getSurveyData } from "lib/server-actions";
import Image from "next/image";
import { Button } from "primereact/button";
import { Toast, ToastMessage } from 'primereact/toast';
import { FormEvent, useEffect, useRef, useState } from "react";

type page = number
type surveyData =  {
    summary: {
        [key: string]: any;
    };
    ownerSurveyData: any;
    clientSurveyData: any;
    teamSurveyData: any;
} | null
export default function ClientSurveyForm({searchParams}:{searchParams:any}) {
    const {users} = useSessionContext()
    
    const toast = useRef<Toast>(null);
    const max_pages = 1
    const [page, setPage] = useState(1)
    let default_submitBtnText = "Next"
    if(max_pages <= 1){
        default_submitBtnText = 'Submit'
    }
    const [submitBtnText, setSubmitBtnText] = useState(default_submitBtnText)
    const [isLoading, setIsLoading] = useState(false)

   const [surveyData,setSurveyData] = useState<surveyData>(null)
   
    const [formSubmitted, setFormSubmitted] = useState(false)
   

    const clinic_id = searchParams.cid
    const user_data = users?.find((i: { _id: string; }) => i._id == `${clinic_id}`)
    const clinic_name = user_data?.clinic_name || ""
    const clinic_logo = user_data?.clinic_logo || ""

    useEffect(()=>{
        getSurveyData(clinic_id)
        .then( d => {
            setSurveyData(d as surveyData)
        })

    },[])

    console.log(surveyData)

    const Alert = ({ severity = 'info', summary = 'Info', detail = 'Message Content' }: ToastMessage) => {
        toast.current?.show({ severity, summary, detail });
    };

    if(!clinic_name){
        Alert({severity: 'error', summary: 'Error', detail: 'Clinic not found'});
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
            let formData = new FormData(form)
            //(servicesUsed, socialMediaUsed) make these fields value a comma separated. 
            let servicesUsed = formData.getAll('servicesUsed').join(",")
            let socialMediaUsed = formData.getAll('socialMediaUsed').join(",")
            // remove 
            formData.delete('servicesUsed')
            formData.delete('socialMediaUsed')
            // add the converted value
            formData.append('servicesUsed', servicesUsed)
            formData.append('socialMediaUsed', socialMediaUsed)

            const res = await ClientSurveyAction(formData)
            if (res.success) {
                form.reset()
                setPage(1)
                setSubmitBtnText("Next")
                // Alert({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully' });
                setFormSubmitted(true)
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
            {formSubmitted && <div className="w-screen h-screen p-10">
                <div className="bg-white p-20 rounded-xl shadow-lg max-w-lg text-center mx-auto mt-28">
                    <p className="pi pi-check-circle text-[10rem] text-green-400"></p>
                    <h1 className="text-2xl font-medium mt-10">Thank you!</h1>
                    <p className="mt-3">Your submission has been sent, you may now safely close this page.</p>
                    


                </div>
            </div>}
            {!formSubmitted && <div className="flex-1 p-6 gap-x-6 gap-y-10 flex flex-col *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-6 max-w-screen-lg mx-auto">
                {/* <div className="col-span-3 row-span-1 flex flex-row items-center justify-between text-xl font-medium">
                    Client survey
                </div> */}
                <form className="max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col !p-10" id="client_survey_form" onSubmit={(e) => handleDefaultSubmit(e, page)}>
                    <div className="flex-1">
                        <div className="flex flex-col items-center mb-10">
                            <Image className="" width="150" height="70" src={clinic_logo} alt={clinic_name} />
                            <h1 className="text-4xl font-medium text-appblue-400 mt-5">Client survey</h1>
                        </div>
                        <div className={`formSectionContainer ${page == 1 ? "" : "!hidden"}`}>
                            {/* <h3 className="text-xl  leading-6 mb-4">Clinic information</h3> */}
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="clinicname" className="formLabel">Clinic name</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input name="clinicid" type="hidden" value={`${clinic_id}`} />
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
                                    <label htmlFor="fname" className="formLabel">First Name</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input
                                                required
                                                type="text"
                                                name="fname"
                                                id="fname"
                                                autoComplete="fname"
                                                className=""
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="lname" className="formLabel">Last Name</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <input
                                                required
                                                type="text"
                                                name="lname"
                                                id="lname"
                                                autoComplete="lname"
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
                                                required
                                                type="email"
                                                name="email"
                                                id="email"
                                                autoComplete="email"
                                            />
                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="recommendation" className="formLabel">On a scale of 0-10, how likely are you to recommend <strong>{clinic_name}</strong> to your friends and family?</label>
                                    <div className="mt-2">
                                        <div className="formField !ring-0 !shadow-none">
                                            <InputRange min={0} max={10} name="recommendation" defaultValue={0} required/>                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="recommendation_feedback" className="formLabel">Please tell us why you gave that score?</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                             <textarea rows={5} name="recommendation_feedback" id="recommendation_feedback" className="" placeholder="" required></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <span className="formLabel">Have you recommended anyone to us previously?</span>
                                    <div className="mt-2">
                                        <div className="formField !ring-0 !shadow-none flex flex-row gap-5 text-base">
                                             <label className="flex flex-row items-center gap-2 cursor-pointer">
                                                <input type="radio" name="recommendedPreviously" value="no" defaultChecked/>
                                                <span>No</span>
                                             </label>
                                             <label className="flex flex-row items-center gap-2 cursor-pointer">
                                                <input type="radio" name="recommendedPreviously" value="yes"required/>
                                                <span>Yes</span>
                                             </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="servicesUsed" className="formLabel">Which of our services have you used?</label>
                                    <div className="mt-2">
                                        <div className="formField ring-0 flex flex-col items-start">
                                        {surveyData?.ownerSurveyData.services_provided?.split(",").map((item:any,index:number)=> {
                                            return (
                                            <label key={index} className="flex flex-row items-center gap-2 cursor-pointer">
                                                <input type="checkbox" name="servicesUsed" value={item} />
                                                <span>{item}</span>
                                            </label>
                                            )
                                        })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                             <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="practitioner" className="formLabel">Overall, how satisfied are you with your practitioner?</label>
                                    <div className="mt-2">
                                        <div className="formField !ring-0 !shadow-none">
                                            <InputRange min={0} max={10} name="practitioner" defaultValue={0} required/>                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="receptionTeam" className="formLabel">Overall, how satisfied are you with our admin team?</label>
                                    <div className="mt-2">
                                        <div className="formField !ring-0 !shadow-none">
                                            <InputRange min={0} max={10} name="receptionTeam" defaultValue={0} required/>                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                         

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="lookAndFeel" className="formLabel">
                                    How would you rate the look and feel of our practice?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="lookAndFeel" defaultValue={0} required/>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="communication" className="formLabel">How satisfied are your with our communication?</label>
                                    <div className="mt-2">
                                         <div className="formField !ring-0 !shadow-none">
                                            <InputRange min={0} max={10} name="communication" defaultValue={0} required/>                                         
                                        </div>
                                    </div>
                                </div>
                            </div>
                            

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="bookingProcess" className="formLabel">
                                    How satisfied are you with our booking process?  
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="bookingProcess" defaultValue={0} required/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="valueForMoney" className="formLabel">
                                    How satisfied are you with the value for money of your treatment with us?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="valueForMoney" defaultValue={0} required/>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="website" className="formLabel">
                                        How satisfied are you with our website?
                                    </label>
                                    <div className="mt-2">
                                        <div className="formField ring-0 flex flex-row">
                                            <InputRange min={0} max={10} name="website" defaultValue={0} required/>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="improvementSuggestion" className="formLabel">Can you suggest anything we can do to improve our service to you?</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                             <textarea rows={5} name="improvementSuggestion" id="improvementSuggestion" className="" placeholder=""></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="socialMediaUsed" className="formLabel">Which social media do you use?</label>
                                    <div className="mt-2">
                                    <div className="formField ring-0 flex flex-col items-start">
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>Facebook</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>Instagram</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>X</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>Twitter</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>Tik Tok</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>Snapchat</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>YouTube</span>
                                        </label>
                                        <label className="flex flex-row items-center gap-2 cursor-pointer">
                                            <input className="!w-4" type="checkbox" name="socialMediaUsed" />
                                            <span>I don’t use social media</span>
                                        </label>

                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <span className="formLabel">Were you able to book a follow up appointment within a reasonable timeframe?</span>
                                    <div className="mt-2">
                                        <div className="formField !ring-0 !shadow-none flex flex-row gap-5 text-base">
                                             <label className="flex flex-row items-center gap-2 cursor-pointer">
                                                <input type="radio" name="followUpBookingConfirmation" value="no" defaultChecked/>
                                                <span>No</span>
                                             </label>
                                             <label className="flex flex-row items-center gap-2 cursor-pointer">
                                                <input type="radio" name="followUpBookingConfirmation" value="yes"required/>
                                                <span>Yes</span>
                                             </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="group_age" className="formLabel">What age group are you in?</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                            <select name="group_age" id="" required>
                                                <option value="under18">Under 18</option>
                                                <option value="1824">18-24</option>
                                                <option value="2539">25-39</option>
                                                <option value="4054">40-54</option>
                                                <option value="5570">55-70</option>
                                                <option value="over70">Over 70</option>
                                                <option value="preferNotToSay">Prefer not to say</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="formSectionContent">
                                <div className="sm:col-span-1">
                                    <label htmlFor="comments_questions" className="formLabel">Do you have any other comments or questions?</label>
                                    <div className="mt-2">
                                        <div className="formField">
                                             <textarea rows={5} name="comments_questions" id="comments_questions" className="" placeholder="" required></textarea>
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