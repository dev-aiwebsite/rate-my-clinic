"use client"
import { FormEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { Toast, ToastMessage } from 'primereact/toast';
import dynamic from "next/dynamic";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useSessionContext } from "@/context/sessionContext";
import Switcher from "./switcher";
import { Button } from "primereact/button";
import { UpdateUser } from "lib/server-actions";
import { useRouter } from "next/navigation";




type E164Number = string;

const InputFileNoSSR = dynamic(() => import("./input-file"), { ssr: false });

type page = number
export default function ProfileForm({ afterSubmit,redirectTo }: { afterSubmit?: () => void,redirectTo?:string }) {

    const toast = useRef<Toast>(null);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false)
    const [phoneValue, setPhoneValue] = useState<E164Number>()
    const phoneInputRef = useRef<any>();
    const { currentUser, setCurrentUser } = useSessionContext()
    const [switchEnabled, setSwitchEnabled] = useState(false);
    const profileFormRef = useRef<HTMLFormElement | null>(null)
    const [validateForm,setValidateForm] = useState<boolean | number>(1)

    const handleSwitcherClick = () => {
        setSwitchEnabled(!switchEnabled);
    };


    const { data } = useSurveyDataContext()
    
    useEffect(() => {
        // Update form fields with default values
        const form = document.getElementById('profile-details-form') as HTMLFormElement;
        if (form) {
        
            if(validateForm){
                if (profileFormRef.current) {
                    let invalidElements = profileFormRef.current.querySelectorAll(':invalid');
                    
                    if(validateForm == 1){
                        invalidElements = profileFormRef.current.querySelectorAll('[data-formpage="1"] :invalid');
        
                    } else if(validateForm == 2){
                        invalidElements = profileFormRef.current.querySelectorAll('[data-formpage="2"] :invalid');
                    }
        
                    invalidElements.forEach((element: Element) => {
                        (element as HTMLInputElement).reportValidity();
                    });
                }
            }

        }
    }, [validateForm]);

    useEffect(()=>{
        const form = document.getElementById('profile-details-form') as HTMLFormElement;
        if (form) {
            Object.keys(currentUser).forEach((key: string | number) => {
                const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
                
                if (input) {
                    if (key == "usermobile") {
                        setPhoneValue(currentUser[key])
                    } else {
                        input.value = currentUser[key];
                    }
                }
            });
        }
    },[currentUser])


    const handlePhoneValidation = useCallback((value: typeof phoneValue) => {
        setPhoneValue(value);
        if (value !== undefined) {
            let valid = isValidPhoneNumber(value);
            let This = phoneInputRef.current;
            This.setCustomValidity(valid ? '' : 'Please enter a valid phone number');
            This.reportValidity();
        }

    }, [setPhoneValue])


    const handleDefaultSubmit = (form:HTMLFormElement)=> {

        const Alert = ({ severity = 'info', summary = 'Info', detail = 'Message Content' }: ToastMessage) => {
            toast.current?.show({ severity, summary, detail });
        };

        setIsLoading(true);
        let formData = new FormData(form)
    
        let plainObject = Object.fromEntries(formData.entries());
        let cleanedFormData = removeEmptyValues(plainObject)
        cleanedFormData['username'] = `${cleanedFormData.fname} ${cleanedFormData.lname}`

        UpdateUser({ useremail: currentUser.useremail }, cleanedFormData)
        .then(res => {
            Alert({ severity: 'success', summary: 'Success', detail: 'Profile updated' });
            setIsLoading(false);
            setCurrentUser(res)
            if(redirectTo){
                router.push(redirectTo)
            } 
            
        })
        .catch(err => {
            Alert({ severity: 'error', summary: 'Error', detail: err });
        })
   

    };

    const handleFormValidation = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>)=>{
        e.preventDefault()
        
        let currentPage = 1
        if(switchEnabled){
            currentPage = 2
        }

        if(profileFormRef.current){
            let form = profileFormRef.current as HTMLFormElement
            let page1 = form.querySelector(`[data-formpage="1"]`) as HTMLFormElement
            let page1_invalidEl = page1.querySelectorAll(':invalid')

            let page2 = form.querySelector(`[data-formpage="2"]`) as HTMLFormElement
            let page2_invalidEl = page2.querySelectorAll(':invalid')

            if(page1_invalidEl.length || page2_invalidEl.length){
                if(currentPage == 1){

                    if(page1_invalidEl.length){
                        setValidateForm(1)
    
                    } else if(page2_invalidEl.length) {
                        setValidateForm(2)
                        setSwitchEnabled(true)
                    }
    
                } else if(currentPage == 2){
    
                    if(page2_invalidEl.length){
                        setValidateForm(2)
    
                    } else if(page1_invalidEl.length) {
                        setValidateForm(1)
                        setSwitchEnabled(false)
                    }
                }
            } else {
                handleDefaultSubmit(form)
            }         
        }
    }



    return (
        <>
          <Toast className="text-sm" ref={toast} />
            <form ref={profileFormRef} className="[&_label]:!text-sm max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col" id="profile-details-form">
               <div className="flex flex-row items-center justify-center">
                <Switcher
                    enabled={switchEnabled}
                    setEnabled={handleSwitcherClick}
                    textone="Profile details"
                    texttwo="Clinic details"
                    />
               </div>
                    <div className={`formSectionContainer ${!switchEnabled ? "" : "hidden"}`}  data-formpage="1">
                        <div className="formSectionContent">
                            <div>
                            <label className="formLabel">Profile image <span className="text-xs text-slate-400">(Optional)</span></label>
                            <div className="mt-2">
                                <div className="formField">

                                <InputFileNoSSR defaultValue={currentUser?.profile_pic} name={"profile_pic"}/>
                                </div>
                            </div>
                            </div>
                            <div className="">
                                <label htmlFor="fname" className="formLabel">First Name</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="text" name="fname" id="fname" className="" placeholder="ex: John" required/>
                                    </div>
                                </div>
                            </div>
                            <div className="">
                                <label htmlFor="lname" className="formLabel">Last Name</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="text" name="lname" id="lname" className="" placeholder="ex: Doe" required/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="useremail" className="formLabel">Email address</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input readOnly type="email" name="useremail" id="useremail" className="" placeholder="ex: johndoe@gmail.com" required/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="usermobile" className="formLabel">Mobile number</label>
                                <div className="mt-2">
                                    <div className="formField">
                                    <PhoneInput
                                        international
                                        className="px-3"
                                        ref={phoneInputRef}
                                        name="usermobile"
                                        placeholder="Enter phone number"
                                        defaultCountry="AU"
                                        value={phoneValue}
                                        onChange={(value)=> handlePhoneValidation(value)}
                                        required
                                        
                                    />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                   

                    <div className={`formSectionContainer ${switchEnabled ? "" : 'hidden'}`} data-formpage="2">
                        <div className="formSectionContent">
                        <div className="">
                                <label htmlFor="logo_upload" className="formLabel">Clinic Logo <span className="text-xs text-slate-400">(Optional)</span></label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <InputFileNoSSR defaultValue={currentUser?.clinic_logo} name={"clinic_logo"}/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="clinic_name" className="formLabel">Clinic Name</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="text" name="clinic_name" id="clinic_name" className="" placeholder="Clinic Name" required/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="clinic_location" className="formLabel">State/Territory</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="text" name="clinic_location_state" id="clinic_location_state" className="" placeholder="State/Territory" required/>
                                    </div>
                                </div>

                                <div className="mt-2">
                                <label htmlFor="clinic_location" className="formLabel">Country</label>
                                    <div className="formField">
                                        <input type="text" name="clinic_location_country" id="clinic_location_country" className="" placeholder="Country" required/>
                                    </div>
                                </div>
                                <div className="mt-2">
                                <label htmlFor="clinic_location" className="formLabel">Postcode/Zipcode</label>
                                    <div className="formField">
                                        <input type="text" name="clinic_location_postcode" id="clinic_location_postcode" className="" placeholder="Postcode/Zipcode" required/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="clinic_established" className="formLabel">When was your clinic established?</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="date" name="clinic_established" id="clinic_established" className="" required/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               
                   
                <div className="w-full flex flex-row justify-end md:items-end mt-10">
                    <Button className="btn-primary md:min-w-32 justify-center" onClick={(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => handleFormValidation(e)} type="button" loading={isLoading}><span>Save</span></Button>
                </div>
            </form>
        </>
    );
}


const removeEmptyValues = (obj: { [x: string]: any; }) => {
    for (const key in obj) {
      if (obj[key] === "") {
        delete obj[key];
      }
    }
    return obj;
  };