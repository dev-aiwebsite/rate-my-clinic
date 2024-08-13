"use client"
import { getSurveyData, OwnerSurveyAction } from "lib/server-actions";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Toast, ToastMessage } from 'primereact/toast';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { Checkbox } from 'primereact/checkbox';
import { useSessionContext } from "@/context/sessionContext";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import Image from "next/image";
import {useRouter} from "next/navigation";
type E164Number = string;

type page = number
const clinicInfoFields = [
    "owner_fname",
    "owner_lname",
    "owner_email",
    "owner_mobile",
    "clinic_name",
    "clinic_location_state",
    "clinic_location_country",
    "clinic_location_postcode",
    "clinic_established"
  ];



export default function Page({searchParams}:{searchParams:any}) {
    const router = useRouter();
    const toast = useRef<Toast>(null);
    const {data, setData} = useSurveyDataContext()
    const formValues = data?.ownerSurveyData
    let isJourney = searchParams.journey == "" ? true : false

    function afterSubmit(){
        router.push('/dashboard/team-survey?journey')
    }
    return (<>
          <Toast className="text-sm" ref={toast} />
        
          <div className="flex-1 p-6 gap-x-10 gap-y-10 flex flex-col gap-10 h-full">
            <div className="card col-span-3 row-span-1 flex flex-row items-center justify-between text-xl font-medium">
                Owner survey
            </div>
            {!formValues || isJourney ? (<div className="setupWrapper bg-black/50 left-0 top-0 fixed h-screen setupWrapper w-screen z-10 p-10 flex gap-4">
            
                <div className="w-96 flex flex-col flex-nowrap -mb-10">
                    <div className="mt-auto relative bg-white w-fit rounded-2xl p-5 mx-auto space-y-4 after:content-[''] after:bg-red after:w-0 after:h-0 after:absolute after:border-solid after:border-[15px] after:border-transparent after:border-t-white after:top-full ">
                        <h1 className="inline-block text-lg font-bold">2. Take the owner survey.</h1>
                        
                        <p className="text-md text-gray-700">{`You need to answer all the questions as accurate as you can. Once submitted your response is recorded in our database.`}</p>
                        <p className="text-md text-gray-700">{`You must complete this step before you can share the Team and Client surveys.`}</p>
                    </div>
                    <Image
                    className="w-[150px] aspect-square" 
                    src="/images/logos/helper_avatar.png"
                    alt="recommendation avatar"
                    width={150}
                    height={150}
                />
                </div>
                <FormComponent additionalClass="w-full flex-1" data={data} setData={setData} afterSubmit={afterSubmit}/>
                </div>)
                : (
                    <FormComponent data={data} setData={setData}/>
                )
                
            } 
           
        </div>
        </>
    );
}


const FormComponent = ({additionalClass,data,setData,afterSubmit}:{additionalClass?:string,data:any,setData:any,afterSubmit?:()=>void}) => { 
    const toast = useRef<Toast>(null);
    const max_pages = 15
    const [isLoading, setIsLoading] = useState(false)
    const [checked, setChecked] = useState(false);
    const [submitBtnType, setSubmitBtnType] = useState("button")
    const [page,setPage] = useState(1)
    const [submitBtnText, setSubmitBtnText] = useState("Next")
    const [phoneValue, setPhoneValue] = useState<E164Number>()
    const phoneInputRef = useRef<any>();
    const [clinicLogo, setClinicLogo] = useState("")
    const {currentUser} = useSessionContext()
    const formValues = data?.ownerSurveyData

    const pathname = usePathname()
    let tocheck = ['profile_pic','clinic_name','clinic_established','clinic_location_country','clinic_location_postcode','clinic_location_state','clinic_logo','usermobile']
    const isProfileComplete = tocheck.every(i => currentUser[i])
    
    if(pathname != '/dashboard/settings/account'){
        if(!isProfileComplete){
            redirect('/dashboard/settings/account')
        }
    }

    
    
    let clinic_id = currentUser._id

    const handlePrev = useCallback((index: page) => {
        if(index <= 1){
            return
        } else {
            setPage(index - 1)
            setSubmitBtnText("Next")
            setSubmitBtnType('button')
        }
    }, [setPage, setSubmitBtnText]);


    const handlePhoneValidation = useCallback((value:typeof phoneValue)=> {
        setPhoneValue(value);
        if (value !== undefined) {
            let valid = isValidPhoneNumber(value);
            let This = phoneInputRef.current;
                This.setCustomValidity(valid ? '' : 'Please enter a valid phone number');
                This.reportValidity();
        }
        
    }, [setPhoneValue])

    const handleNext = useCallback((index: page) => {
        if (index < max_pages) {
            const form = document.getElementById('owner-survey-form') as HTMLFormElement;
            const currentPageItems = Array.from(form.querySelectorAll(`[data-formpage="${page}"] input[name], [data-formpage="${page}"] select[name], [data-formpage="${page}"] textarea[name]`)) as HTMLFormElement[];
            if (form && !currentPageItems.every(i => i.reportValidity()) ) {
                return;
            } else {
                setPage(index + 1)
                if (page + 1 >= max_pages) {
                    setSubmitBtnText("Submit")
                    setSubmitBtnType('submit')
                }
            }
        }
    }, [page, max_pages, setPage, setSubmitBtnText]);


    const handleDefaultSubmit = useCallback(async (e: FormEvent, index: page) => {
        e.preventDefault();
        const Alert = ({ severity = 'info', summary = 'Info', detail = 'Message Content' }: ToastMessage) => {
            toast.current?.show({ severity, summary, detail });
        };

        let form = e.target as HTMLFormElement;
        let isAccepted = (form.querySelector('[name="terms_acknowledgement"]') as HTMLInputElement)?.checked;
        if (!isAccepted) {
            Alert({ severity: 'warn', summary: 'Warning', detail: "Please accept the terms and conditions before submitting the form." });
            return false;
        }
    
        setIsLoading(true);
        const res = await OwnerSurveyAction(new FormData(form));
        if (res.success) {
            
            setSubmitBtnText("Next");
            Alert({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully' });
            
            
            getSurveyData().then(d => {
                setPage(1);
                setIsLoading(false);
                setData(d)

                if(afterSubmit){
                   afterSubmit()
                } 


            });
          

        } else {
            Alert({ severity: 'error', summary: 'Error', detail: res.message });
        }
    }, [setIsLoading, setPage, setSubmitBtnText]);

            
    useEffect(() => {
        // Update form fields with default values
            const form = document.getElementById('owner-survey-form') as HTMLFormElement; 
            if (form) {
                console.log('running defaultValues')
                let formFields:NodeListOf<HTMLInputElement> = form.querySelectorAll('[name]')
                
                formFields.forEach((ff) => {
                    let key = ff.name
                    if(key == "owner_mobile"){
                        setPhoneValue(currentUser.usermobile)
                    }else if(key == 'clinic_logo'){
                        setClinicLogo(currentUser.clinic_logo)

                    } else if (clinicInfoFields.includes(key)){
                        
                        key.includes('name') ? key = key.replace("owner_","") : key = key.replace("owner_","user")
                        
                        ff.value = currentUser[key];
                    } else {
                        if(formValues){
                            ff.value = formValues[key];
                        }
                    }

                })

            }
    }, []);

    
    return <><form className={`card max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col z-[20] ${additionalClass}`} id="owner-survey-form" onSubmit={(e) => handleDefaultSubmit(e,page)}>
<input type="hidden" name="clinic_id" value={clinic_id}/>
<div className="flex-1 overflow-y-scroll *:p-2">
    <div className={`formSectionContainer ${page == 1 ? "" : "!hidden"}`} data-formpage="1">
        <h3 className="formSectionHeader">Clinic Owner Details</h3>
        <p className="text-center text-stone-400">You can update your information in the <Link className="opacity-80 hover:opacity-100 font-medium underline text-sky-700" href="/dashboard/settings/account" >settings.</Link></p>
        
        <div className="formSectionContent">
            <div className="sm:col-span-1">
                <label htmlFor="owner_fname" className="formLabel">Clinic owner first name</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="text" name="owner_fname" id="owner_fname" className="" placeholder="You can add/edit this field in profile settings" required readOnly/>
                    </div>
                </div>
            </div>
            <div className="sm:col-span-1">
                <label htmlFor="owner_lname" className="formLabel">Clinic owner last name</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="text" name="owner_lname" id="owner_lname" className="" placeholder="You can add/edit this field in profile settings" required readOnly/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="owner_email" className="formLabel">Email address</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="email" name="owner_email" id="owner_email" className="" placeholder="Email address" required readOnly/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="owner_mobile" className="formLabel">Mobile number</label>
                <div className="mt-2">
                    <div className="formField">
                    <PhoneInput
                        className="px-3"
                        ref={phoneInputRef}
                        name="owner_mobile"
                        
                        placeholder="Enter phone number"
                        value={phoneValue}
                        onChange={(value)=> handlePhoneValidation(value)}
                        required
                        readOnly
                        
                    />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className={`formSectionContainer ${page == 2 ? "" : "!hidden"}`} data-formpage="2">
        <h3 className="formSectionHeader">Clinic Details</h3>
        <p className="text-center text-stone-400">You can update your information in the <Link className="opacity-80 hover:opacity-100 font-medium underline text-sky-700" href="/dashboard/settings/account" >settings.</Link></p>
        <div className="formSectionContent">
            
            <div className="sm:col-span-1">
                <label htmlFor="clinic_name" className="formLabel">Clinic Name</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="text" name="clinic_name" id="clinic_name" className="" placeholder="You can add/edit this field in profile settings" required readOnly/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="clinic_location" className="formLabel">Clinic location</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="text" name="clinic_location_state" id="clinic_location_state" className="" placeholder="You can add/edit this field in profile settings" required readOnly/>
                        <input type="text" name="clinic_location_country" id="clinic_location_country" className="" placeholder="" required readOnly/>
                        <input type="text" name="clinic_location_postcode" id="clinic_location_postcode" className="" placeholder="" required readOnly/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="clinic_established" className="formLabel">When was your clinic established?</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="date" name="clinic_established" id="clinic_established" className="" required readOnly placeholder="You can add/edit this field in profile settings"/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="clinic_logo" className="formLabel">Please upload your logo. This is used to brand the client and team surveys.</label>
                <div className="mt-2">
                    <div className="formField p-2">
                        {clinicLogo && <><Image width={600} height={600} src={clinicLogo} className="w-auto max-h-20" alt={""} /> <input type='hidden' name="clinic_logo" value={clinicLogo}/></>}
                        {!clinicLogo && <input value="" placeholder="You can add/edit this field in profile settings" name="clinic_logo" required readOnly/>}
                        
                    </div>
                </div>
            </div>

        </div>
    </div>


    <div className={`formSectionContainer ${page == 3 ? "" : "!hidden"}`} data-formpage="3">
        <h3 className="formSectionHeader">Services Provided</h3>
        <div className="formSectionContent">

            <div className="sm:col-span-1">
                <label htmlFor="services_provided" className="formLabel">Which services do you provide? Please double check for spelling as these will be used in your client survey.</label>
                <p className="field_instruction">*Please separate each response with a comma. (e.g. Massage, Physical Therapy, Chiropractic)</p>
                <div className="mt-2">
                    <div className="formField">
                        {/* go back here */}
                        <textarea name="services_provided" id="" placeholder=" e.g. Massage, Physical Therapy, Chiropractic" required></textarea>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="ndis_clients" className="formLabel">Do you have NDIS clients?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="ndis_clients" id="ndis_clients" className="" required>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="unsure">Unsure</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>    
    </div>

    <div className={`group formSectionContainer ${page == 4 ? "" : "!hidden"}`} data-formpage="4">
        <h3 className="formSectionHeader">Clinic Building Ownership</h3>
        <div className="formSectionContent">

            <div className="sm:col-span-1">
                <label htmlFor="own_building" className="formLabel">Do you own the building at 1 or more of your clinic locations?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="own_building" id="own_building" className="" required>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1 group-has-[[value=no]:checked]:hidden">
                <label htmlFor="pay_market_rent" className="formLabel">If yes to above. Do you pay a market rent?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="pay_market_rent" id="pay_market_rent" className="">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1 group-has-[[value=yes]:checked]:hidden">
                <label htmlFor="market_rate_difference" className="formLabel">If no, how much over/under the market rate are you? (in thousands)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="market_rate_difference" id="market_rate_difference" className="" placeholder="Amount in thousands" />
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div className={`group formSectionContainer ${page == 5 ? "" : "!hidden"}`} data-formpage="5">
        <h3 className="formSectionHeader">Group Classes</h3>
        <div className="formSectionContent">

            <div className="sm:col-span-1">
                <label htmlFor="group_classes" className="formLabel">Do you run any group classes?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="group_classes" id="group_classes" className="" required>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                            <option value="not_applicable">Not applicable</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1 group-has-[[value=yes]:checked]:block hidden">
                <label htmlFor="classes_per_week" className="formLabel">If yes, how many classes do you run per week approximately?</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="classes_per_week" id="classes_per_week" className="" placeholder="Number of classes" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className={`formSectionContainer ${page == 6 ? "" : "!hidden"}`} data-formpage="6">
        <h3 className="formSectionHeader">Practice Management Software</h3>
        <div className="formSectionContent">

            <div className="sm:col-span-1">
                <label htmlFor="practice_management_software" className="formLabel">What is your practice management software?</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="text" name="practice_management_software" id="practice_management_software" className="" placeholder="Software name" required/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className={`formSectionContainer ${page == 7 ? "" : "!hidden"}`} data-formpage="7">
        <h3 className="formSectionHeader">Consult charges</h3>
        <div className="formSectionContent">

            <div className="sm:col-span-1">
                <label htmlFor="initial_consult_charge" className="formLabel">What do you charge for an initial consult?</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="initial_consult_charge" id="initial_consult_charge" className="" placeholder="Charge in $" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="initial_consult_duration" className="formLabel">How long is that appointment? (in minutes)</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="initial_consult_duration" id="initial_consult_duration" className="" required>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="followup_consult_charge" className="formLabel">What do you charge for a follow up consult?</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="followup_consult_charge" id="followup_consult_charge" className="" placeholder="Charge in $" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="followup_consult_duration" className="formLabel">How long is that appointment? (in minutes)</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="followup_consult_duration" id="followup_consult_duration" className="" required>
                            <option value="20">20</option>
                            <option value="30">30</option>
                            <option value="40">40</option>
                            <option value="45">45</option>
                            <option value="60">60</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className={`group formSectionContainer ${page == 8 ? "" : "!hidden"}`} data-formpage="8">
        <h3 className="formSectionHeader">Business Plan</h3>
        <div className="formSectionContent">
            {/* <!-- Business Plan --> */}
            <div className="sm:col-span-1">
                <label htmlFor="current_business_plan" className="formLabel">Do you have a current business plan?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="current_business_plan" id="current_business_plan" className="" required>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>
 
        <div className="sm:col-span-1 group-has-[[value=no]:checked]:hidden">
            <label htmlFor="plan_execution" className="formLabel">How do you feel you have executed your plan in the last 12 months? (1-100)</label>
            <div className="mt-2">
                <div className="formField">
                    <input type="number" name="plan_execution" id="plan_execution" className="" min="1" max="100" placeholder="1-100"required/>
                </div>
            </div>
        </div>

        <div className="sm:col-span-1 group-has-[[value=no]:checked]:hidden">
            <label htmlFor="plan_review_timeline" className="formLabel">How long has it been since you reviewed your business plan?</label>
            <p className="field_instruction">*In years, to 1 decimal point.</p>
            <div className="mt-2">
                <div className="formField">
                    <input type="number" name="plan_review_timeline" id="plan_review_timeline" className="" min="1" max="" placeholder="In months"required/>
                </div>
            </div>
        </div>

        </div>
    </div>

    <div className={`formSectionContainer ${page == 9 ? "" : "!hidden"}`} data-formpage="9">
        <h3 className="formSectionHeader">Exit Plan</h3>
        <div className="formSectionContent">

            {/* <!-- Exit Plan --> */}
            <div className="sm:col-span-1">
                <label htmlFor="exit_plan" className="formLabel">Do you have an exit plan for your business?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="exit_plan" id="exit_plan" className="" required>
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* <!-- Business Leave Comfort Level --> */}
            <div className="sm:col-span-1">
                <label htmlFor="leave_comfort_level" className="formLabel">How comfortable would you be in leaving your business for 3 months? (1-100)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="leave_comfort_level" id="leave_comfort_level" className="" min="1" max="100" placeholder="1-100" required/>
                    </div>
                </div>
            </div>

            </div>
    </div>

    <div className={`formSectionContainer ${page == 10 ? "" : "!hidden"}`} data-formpage="10">
        <h3 className="formSectionHeader">Weekly Hours</h3>
        <div className="formSectionContent">

            {/* <!-- Weekly Hours --> */}
            <div className="sm:col-span-1">
                <label htmlFor="treating_hours" className="formLabel">How many hours do you spend each week (on average) treating clients? (0-60)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="treating_hours" id="treating_hours" className="" min="0" max="60" placeholder="Hours per week" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="managing_hours" className="formLabel">How many hours do you spend each week (on average) managing your business? (0-60)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="managing_hours" id="managing_hours" className="" min="0" max="60" placeholder="Hours per week" required/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className={`formSectionContainer ${page == 11 ? "" : "!hidden"}`} data-formpage="11">
        <h3 className="formSectionHeader">Payment</h3>
        <div className="formSectionContent">

            {/* <!-- Payment for Treating Clients --> */}
            <div className="sm:col-span-1">
                <label htmlFor="pay_treating_clients" className="formLabel">How much do you pay yourself to treat clients (on average) each week? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="pay_treating_clients" id="pay_treating_clients" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>

            {/* <!-- Payment for Managing Business --> */}
            <div className="sm:col-span-1">
                <label htmlFor="pay_managing_business" className="formLabel">How much do you pay yourself to manage the business (on average) each week? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="pay_managing_business" id="pay_managing_business" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className={`formSectionContainer ${page == 12 ? "" : "!hidden"}`} data-formpage="12">
        <h3 className="formSectionHeader">Financial Information</h3>
        <p className="text-center mx-auto text-red-400">Please provide the relevant data for the last 12 months (or the last full financial year if easier).</p>
        <div className="formSectionContent">

            {/* <!-- Financial Information --> */}
            <div className="sm:col-span-1">
                <label htmlFor="turnover" className="formLabel">What is your turnover? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="turnover" id="turnover" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="profit" className="formLabel">What is your profit? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="profit" id="profit" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="total_wages" className="formLabel">What is the total of all wages including super if applicable? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="total_wages" id="total_wages" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="non_clinician_wages" className="formLabel">What is the total of all non-clinician wages including super if applicable? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="non_clinician_wages" id="non_clinician_wages" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="rent" className="formLabel">What is your rent inclusive of any applicable outgoings? ($)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="rent" id="rent" className="" placeholder="Amount in $" required/>
                    </div>
                </div>
            </div>

            {/* <!-- Cash Reserves --> */}
            <div className="sm:col-span-1">
                <label htmlFor="cash_reserves" className="formLabel">How many months would your cash reserves cover your outgoings?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="cash_reserves" id="cash_reserves" className="" required>
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4+</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div className={`formSectionContainer ${page == 13 ? "" : "!hidden"}`} data-formpage="13">
        <h3 className="formSectionHeader">Client Base Survey</h3>
        <div className="formSectionContent">

            {/* <!-- Client Base Survey --> */}
            <div className="group">
                <div className="sm:col-span-1">
                    <label htmlFor="client_survey" className="formLabel">Have you ever surveyed your entire client base before?</label>
                    <div className="mt-2">
                        <div className="formField">
                            <select name="client_survey" id="client_survey" className="" required>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="sm:col-span-1 group-has-[[value=no]:checked]:hidden">
                    <label htmlFor="last_client_survey" className="formLabel">If yes, how long ago did you do that?</label>
                    <p className="field_instruction">*In years, to 1 decimal point. (For example, 2 years and 6 months should be entered as 2.5)</p>
                    <div className="mt-2">
                        <div className="formField">
                            <input type="number" step="0.1" name="last_client_survey" id="last_client_survey" className="" placeholder="2.5" required/>
                        </div>
                    </div>
                </div>
            </div>
          


            {/* <!-- Email Software --> */}
            <div className="sm:col-span-1">
                <label htmlFor="email_software" className="formLabel">What software do you use to email your clients?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="email_software" id="email_software" className="">
                            <option value="mailchimp">Mailchimp</option>
                            <option value="outlook">Outlook</option>
                            <option value="gmail">Gmail</option>
                            <option value="peptalkr">Peptalkr</option>
                            <option value="other">Other – please specify</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* <!-- New Clients Source --> */}
            <div className="sm:col-span-1">
                <label htmlFor="client_source" className="formLabel">Do you know the source of your new clients split by major categories? E.g. referrals from friend/family, GP referral, Google, Driving/walking by etc.</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="client_source" id="client_source" className="">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <div className={`group formSectionContainer ${page == 14 ? "" : "!hidden"}`} data-formpage="14">
        <h3 className="formSectionHeader !hidden">Business Plan</h3>
        <div className="formSectionContent">

            {/* <!-- Written Treatment Plans --> */}
            <div className="sm:col-span-1">
                <label htmlFor="written_treatment_plans" className="formLabel">Do you use written treatment plans?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="written_treatment_plans" id="written_treatment_plans" className="">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* <!-- Employee Satisfaction Survey --> */}
            <div className="sm:col-span-1">
                <label htmlFor="employee_satisfaction_survey" className="formLabel">Have you ever surveyed your employees satisfaction level?</label>
                <div className="mt-2">
                    <div className="formField">
                        <select name="employee_satisfaction_survey" id="employee_satisfaction_survey" className="">
                            <option value="yes">Yes</option>
                            <option value="no">No</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="sm:col-span-1 group-has-[[name=employee_satisfaction_survey][value=no]:checked]:hidden">
                <label htmlFor="last_employee_survey" className="formLabel">If yes, how long ago did you do that?</label>
                <p className="field_instruction">*In years, to 1 decimal point. (For example, 2 years and 6 months should be entered as 2.5)</p>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" step="0.1" name="last_employee_survey" id="last_employee_survey" className="" placeholder="2.5" required/>
                    </div>
                </div>
            </div>

            {/* <!-- Number of Employees --> */}
            <div className="sm:col-span-1">
                <label htmlFor="number_of_clinicians" className="formLabel">How many clinicians do you employ?</label>
                    <div className="mt-2">
                        <div className="formField">
                            <input type="number" name="number_of_clinicians" id="number_of_clinicians" className="" placeholder="Number of clinicians" required/>
                        </div>
                    </div>
            </div>

            <div className="sm:col-span-1">
                <label htmlFor="number_of_non_clinicians" className="formLabel">How many non-clinicians do you employ?</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="number_of_non_clinicians" id="number_of_non_clinicians" className="" placeholder="Number of non-clinicians" required/>
                    </div>
                </div>
            </div>

            {/* <!-- Work/Life Balance --> */}
            <div className="sm:col-span-1">
                <label htmlFor="work_life_balance" className="formLabel">How would you rate your work/life balance? (0-100)</label>
                <div className="mt-2">
                    <div className="formField">
                        <input type="number" name="work_life_balance" id="work_life_balance" className="" min="0" max="100" placeholder="0-100" required/>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className={`formSectionContainer ${page == 15 ? "" : "!hidden"}`} data-formpage="15">
        <h3 className="formSectionHeader">Terms and Conditions Acknowledgement</h3>
        <div className="formSectionContent">

            <div className="h-[50vh] overflow-y-auto ring-1 ring-gray-300 rounded-md p-10 text-sm [&_h2]:-ml-7 [&_h2]:font-bold [&_h2]:text-base [&_ol_li]:pl-4 [&_ol_ol]:ml-8 [&_ol_ol]:mb-6 [&_li:first-child]:mt-2">

            <ol className="list-decimal">
      <li className="font-bold">Introduction</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>This agreement governs the provision of the Services.</li>
        <li>
          You can accept this Agreement as described in our engagement letter, or by continuing to instruct us in relation to the Services.
        </li>
      </ol>

      <li className="font-bold">Our Services</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>
          Unless expressly specified in our engagement letter, the Services are not performed in accordance with any auditing, review or assurance standards and the use of the terms “audit”, “assurance” or “review” or any similar in any materials, including the engagement letter or deliverables, whether express or implied, is not intended to suggest otherwise.
        </li>
        <li>
          We may provide services to persons whose interests compete or conflict with yours, provided that where we determine that the provision of such services gives rise to a specific and direct conflict of interest, we will put in place appropriate ethical dividers.
        </li>
      </ol>

      <li className="font-bold">Information and Access Provided by You</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>You agree to promptly provide us with all relevant assistance, information, access to personnel, and other materials, reasonably required to provide the Services.</li>
        <li>
          We will rely on the accuracy and completeness of Your Materials and will not verify it. You must notify us in writing of any changes to Your Materials that may affect the Services.
        </li>
        <li>
          In providing the Services, we will only be regarded as having or knowing information provided to or known by the Personnel providing the Services. This is the case even if other Personnel have separately been provided or know additional information.
        </li>
        <li>
          We may use the information obtained in performing the Services for Business Purposes, provided that any outputs are anonymous or aggregated so that no Personal Information or information relating specifically to you is reasonably identifiable.
        </li>
      </ol>

      <li className="font-bold">Use of Our Services</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>
          Any Deliverable is for your sole use and benefit and may only be used for the purpose set out in this Agreement or otherwise agreed by us in writing. Subject to Clause 6(b), you may not provide any Deliverable to a third party, or use our name, logo, trademarks in any marketing, promotional material or other publication unless required by law or with our prior written consent.
        </li>
        <li>
          We will not update the Deliverables after we have delivered them in final form and will not be responsible for any changes you make to them without our prior written consent.
        </li>
        <li>
          You are responsible and accountable for managing your business and affairs and deciding what to do after receiving the Services, including whether to implement our advice or recommendations.
        </li>
      </ol>

      <li className="font-bold">Our Fees</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>You agree to pay our fees set out in the engagement letter and where applicable compliance charges per clause 5.d.</li>
        <li>Our fees and expenses are quoted exclusive of GST unless otherwise stated.</li>
        <li>You agree to pay our fees and expenses within 7 days the date of issue of our invoice.</li>
        <li>
          If we are required by law or any judicial, regulatory, professional or administrative process (excluding any claim or regulatory action against us) to produce information or give evidence in relation to the Services, you agree to pay for the time spent and any expenses incurred by us in complying and cooperate with us, including to provide any consent, for us to comply.
        </li>
      </ol>

      <li className="font-bold">Confidential Information</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>Each party will keep the other’s Confidential Information confidential and use it only for the purposes permitted in this Agreement. Each party will protect the other’s Confidential Information as if it would protect its own, using at least a reasonable standard of care.</li>
        <li>
          We may disclose the other’s Confidential Information to:
          <ol style={{ listStyleType: 'lower-roman' }}>
            <li>our insurers, professional advisers or financiers;</li>
            <li>the extent required for us to comply with applicable professional or ethical standards or codes, or where we are required to do so by a regulator;</li>
            <li>the extent required by law;</li>
            <li>with the prior written consent of the disclosing party.</li>
          </ol>
        </li>
        <li>
          We may use and disclose:
          <ol style={{ listStyleType: 'lower-roman' }}>
            <li>knowledge, experience and skills of general application gained through providing the Services;</li>
            <li>your clinic name, logo, and a description of the Services for marketing purposes.</li>
          </ol>
        </li>
        <li>We own our internal working documents and all intellectual property rights in the Services. We grant you a non-exclusive, non-transferrable, royalty-free license to use the Deliverables in accordance with Clause 4(a).</li>
        <li>This Agreement does not affect any ownership of any intellectual property rights you have in Your Material. You grant us a non-exclusive, non-transferrable, royalty-free license to use Your Materials as described in this Agreement. You must ensure that use of Your Materials in accordance with this Agreement does not infringe the rights of third parties.</li>
        <li>You agree to provide all necessary notifications and obtain any necessary permissions or consents in connection with our use of Personal Information or Confidential Information as contemplated by this Agreement.</li>
      </ol>

      <li className="font-bold">Liability</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>To the extent permissible by law, we are not liable for any indirect or consequential Loss, Loss to business, goodwill or reputation, Loss of revenue or profits; Loss of, or damage to, or unauthorized access to data; or business interruption.</li>
        <li>You agree not to bring a claim against any Personnel in connection with any services they perform which fail to meet the requirements of the Agreement.</li>
        <li>Each party (“indemnifying party”) indemnifies the other party (“indemnified party”) against any loss, expense, damage, or liability suffered or incurred by the indemnified party as a result of a Claim arising out of or in connection with an act or omission of the indemnifying party in performing its obligations under this agreement, (including the provision of the Services).</li>
      </ol>

      <li className="font-bold">Suspension and Termination</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>We may suspend the Services for as long as any fees payable by you are overdue; you fail to provide us with assistance, information, or access required under clause 3 or if there is a dispute per clause 9.</li>
        <li>
          Either party may terminate this Agreement immediately by written notification if the other materially breaches this Agreement and fails to remedy the breach within 14 days; the other becomes insolvent; or the services are suspended for greater than 21 days per clause 8(a).
        </li>
        <li>We may also terminate this Agreement with written notice if, in our reasonable opinion, our provision of the Services breaches any applicable laws, regulations, professional or ethical standards or codes, or has the potential to bring us into disrepute.</li>
        <li>Termination does not affect any accrued rights of either party including your obligation to pay our fees and expenses for work performed up to the effective termination date.</li>
      </ol>

      <li className="font-bold">Dispute Resolution</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>If any dispute arises in connection with this Agreement, the party raising the dispute must notify the other party with sufficient detail to enable the dispute to be considered (Dispute Notice) and the parties must engage with confidential senior-level negotiations with a view to resolving the dispute.</li>
        <li>If a dispute has not been resolved in 14 days after the Dispute Notice, the parties agree to refer the dispute to mediation as soon as practical.</li>
        <li>If a dispute has not been resolved following mediation, the dispute must be referred to arbitration.</li>
      </ol>

      <li className="font-bold">General</li>
      <ol style={{ listStyleType: 'lower-alpha' }}>
        <li>This Agreement is governed by the laws of South Australia (SA) and subject to clause 9, the parties unconditionally submit to the exclusive jurisdiction of the courts sitting in SA.</li>
        <li>This Agreement does not limit or exclude any liability of a party that cannot be excluded or limited by law.</li>
        <li>Subject to clause 10(b), this Agreement constitutes the entire agreement between us regarding the provision of the Services and supersedes any previous agreements, whether oral or written.</li>
        <li>You may not assign this Agreement without our prior written consent. We may subcontract any part of the Services to any of our Affiliates or other third parties.</li>
        <li>Except as otherwise stated in this Agreement, a person who is not a party to this Agreement may not enforce any of its terms.</li>
        <li>Nothing in this Agreement creates a partnership or joint venture, or employment or agency relationship.</li>
        <li>Clauses 4, 5, 6, 7, 8(d), 9, and 10(a) survive termination of this Agreement.</li>
      </ol>
  

        <li className="font-bold">Definitions</li>
        <ol style={{ listStyleType: 'lower-alpha' }}>
            <li>Agreement means these terms and the engagement letter provided with these terms.</li>
            <li>Business Purposes means to enable us to provide and enhance services and deliverables to clients, to develop expertise and know-how, to undertake benchmarking, analytics, and thought leadership.</li>
            <li>Confidential Information means information disclosed in connection with this Agreement which by its nature is confidential, is designated as confidential, but does not include information that is in the public domain without breach of confidence, is obtained from a third party without an obligation of confidence, or is independently developed without breach of this Agreement.</li>
            <li>Deliverable means any advice, recommendation, information or other deliverable made available to you in any form, whether electronic, digital, hard copy or otherwise (including any draft).</li>
            <li>Loss means any loss including any liability, cost, expense (including legal costs on a full indemnity basis), Claim, proceeding, action, demand or damage suffered by you in connection with the Services.</li>
            <li>Personal Information has the meaning given to that term in the Privacy Act 1988 (Cth).</li>
            <li>Personnel means the officers, employees, contractors, secondees, and agents of us.</li>
            <li>Services means the services and Deliverables that we do, or are required to, provide to you as set out in our engagement letter.</li>
            <li>We, Us (or derivatives) means Rate My Clinic, ABN: 33 084 046 702.</li>
            <li>Your Materials means any information, materials, systems, technology or equipment provided or made available to us by you or third parties on your behalf in the performance of the Services.</li>
        </ol>
        </ol>
         
            </div>
            <div className="sm:col-span-1 flex flex-row-reverse items-center justify-center gap-2">
                <label htmlFor="terms_acknowledgement" className="formLabel">Do you acknowledge you have read our terms and conditions?</label>
                <div className="">
                        <Checkbox className="[&_.p-checkbox-box]:!border-2 [&_.p-checkbox-box]:hover:!border-[#1d4ed8] [&.p-highlight_.p-checkbox-box]:!border-[#3b82f6]" onChange={e => setChecked(e.checked!)} checked={checked} name="terms_acknowledgement" id="terms_acknowledgement" required></Checkbox>
                </div>
            </div>
        </div>
    </div>
</div>
<div className="w-full flex flex-row justify-end items-end">
    <button className={`btn ${page != 1 ? "" : "!hidden"}`} onClick={() => handlePrev(page)} type="button">Back</button>
    <button className="btn-primary min-w-60" type={submitBtnType as "button" | "submit"} onClick={() => handleNext(page)} form="owner-survey-form">{submitBtnText}</button>
</div>
    </form></>
}
