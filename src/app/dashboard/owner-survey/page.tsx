"use client"
import { OwnerSurveyAction } from "@/server-actions";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Toast, ToastMessage } from 'primereact/toast';
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { Checkbox } from 'primereact/checkbox';
import { useSessionContext } from "@/context/sessionContext";
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



export default function Page() {
    
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

    const {data} = useSurveyDataContext()
    let clinic_id = currentUser._id
    let defaultValue = data?.ownerSurveyData as Record<string, any>
    useEffect(() => {
        // Update form fields with default values
            const form = document.getElementById('owner-survey-form') as HTMLFormElement;
            if (form) {

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
                        if(defaultValue){
                            ff.value = defaultValue[key];
                        }
                    }

                })

            }
    }, []);

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
            form.reset();
            setPage(1);
            setSubmitBtnText("Next");
            Alert({ severity: 'success', summary: 'Success', detail: 'Form submitted successfully' });
            setIsLoading(false);
        } else {
            Alert({ severity: 'error', summary: 'Error', detail: res.message });
        }
    }, [setIsLoading, setPage, setSubmitBtnText]);

    
    return (<>
          <Toast className="text-sm" ref={toast} />
          <div className="flex-1 p-6 gap-x-10 gap-y-10 max-md:flex max-md:flex-col grid grid-cols-3 grid-rows-6 *:bg-white *:shadow-lg *:rounded-lg *:py-6 *:px-10">
            <div className="col-span-3 row-span-1 flex flex-row items-center justify-between text-xl font-medium">
                Owner survey
            </div>
            <form className="max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col" id="owner-survey-form" onSubmit={(e) => handleDefaultSubmit(e,page)}>
                <input type="hidden" name="clinic_id" value={clinic_id}/>
                <div className="flex-1">
                    <div className={`formSectionContainer ${page == 1 ? "" : "!hidden"}`} data-formpage="1">
                        <h3 className="formSectionHeader">Clinic Owner Details</h3>
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
                                        {clinicLogo && <><img src={clinicLogo} className="max-h-20"/> <input type='hidden' name="clinic_logo" value={clinicLogo}/></>}
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
                                <div className="mt-2">
                                    <div className="formField">
                                        {/* go back here */}
                                        <textarea name="services_provided" id="" placeholder="Enter services provided (separated by commas) e.g. Massage, Physical Therapy, Chiropractic" required></textarea>
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

                            <div className="sm:col-span-1 group-has-[[value=no]:checked]:hidden">
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

                            <div className="sm:col-span-1">
                                <label htmlFor="last_client_survey" className="formLabel">If yes, how long ago did you do that? (in years, to 1 decimal point)</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="number" step="0.1" name="last_client_survey" id="last_client_survey" className="" placeholder="eg: 1.2 (1 year and 2 months ago)" required/>
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
                                <label htmlFor="last_employee_survey" className="formLabel">If yes, how long ago did you do that? (in years, to 1 decimal point)</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="number" step="0.1" name="last_employee_survey" id="last_employee_survey" className="" placeholder="eg: 1.2 (1 year and 2 months ago)" required/>
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

                            {/* <!-- Terms and Conditions Acknowledgement --> */}
                            <div className="sm:col-span-1 flex flex-row-reverse items-center justify-center gap-2">
                                <label htmlFor="terms_acknowledgement" className="formLabel">Do you acknowledge you have read our terms and conditions? (insert link to them)</label>
                                <div className="">
                                        <Checkbox className="[&_.p-checkbox-box]:!border-2 [&_.p-checkbox-box]:hover:!border-[#1d4ed8] [&.p-highlight_.p-checkbox-box]:!border-[#3b82f6]" onChange={e => setChecked(e.checked!)} checked={checked} name="terms_acknowledgement" id="terms_acknowledgement"></Checkbox>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-end items-end">
                    <button className={`btn ${page != 1 ? "" : "!hidden"}`} onClick={() => handlePrev(page)} type="button">Back</button>
                    <button className="btn-primary min-w-60" type={submitBtnType as "button" | "submit"} onClick={() => handleNext(page)} form="owner-survey-form">{submitBtnText}</button>
                </div>
            </form>
        </div>
        </>
    );
}
