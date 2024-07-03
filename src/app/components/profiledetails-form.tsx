"use client"
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { Toast, ToastMessage } from 'primereact/toast';
import dynamic from "next/dynamic";
import 'react-phone-number-input/style.css'
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useSessionContext } from "@/context/sessionContext";
import Switcher from "./switcher";
import { Button } from "primereact/button";
import { UpdateUser } from "@/server-actions";

type E164Number = string;

const InputFileNoSSR = dynamic(() => import("@/components/input-file"), { ssr: false });

type page = number
export default function ProfileForm({ handleSubmit }: { handleSubmit?: () => void }) {

    const toast = useRef<Toast>(null);

    const [isLoading, setIsLoading] = useState(false)
    const [phoneValue, setPhoneValue] = useState<E164Number>()
    const phoneInputRef = useRef<any>();
    const [clinicLogo, setClinicLogo] = useState("")
    const { currentUser, setCurrentUser } = useSessionContext()
    const [profilePic, setProfilePic] = useState(currentUser.profile_pic)
    const [switchEnabled, setSwitchEnabled] = useState(false);

    const handleSwitcherClick = () => {
        setSwitchEnabled(!switchEnabled);
    };

    const { data } = useSurveyDataContext()

    let defaultValue = currentUser
    
    useEffect(() => {
        // Update form fields with default values
        const form = document.getElementById('profile-details-form') as HTMLFormElement;
        if (form) {
            Object.keys(defaultValue).forEach((key: string | number) => {
                const input = form.querySelector(`[name="${key}"]`) as HTMLInputElement;
                if (key == 'clinic_logo') {
                    setClinicLogo(defaultValue[key])
                }
                if (input) {
                    if (key == "usermobile") {
                        setPhoneValue(defaultValue[key])
                    } else {
                        input.value = defaultValue[key];
                    }
                }
            });
        }
    }, [defaultValue]);


    const handlePhoneValidation = useCallback((value: typeof phoneValue) => {
        setPhoneValue(value);
        if (value !== undefined) {
            let valid = isValidPhoneNumber(value);
            let This = phoneInputRef.current;
            This.setCustomValidity(valid ? '' : 'Please enter a valid phone number');
            This.reportValidity();
        }

    }, [setPhoneValue])


    const handleDefaultSubmit = useCallback((e: FormEvent) => {
        e.preventDefault();
        const Alert = ({ severity = 'info', summary = 'Info', detail = 'Message Content' }: ToastMessage) => {
            toast.current?.show({ severity, summary, detail });
        };
        let form = e.target as HTMLFormElement;
        setIsLoading(true);
        let formData = new FormData(form)
    
        let plainObject = Object.fromEntries(formData.entries());
        let cleanedFormData = removeEmptyValues(plainObject)
        cleanedFormData['username'] = `${cleanedFormData.fname} ${cleanedFormData.lname}`

        UpdateUser({ useremail: currentUser.useremail }, cleanedFormData)
        .then(res => {
            form.reset();
            Alert({ severity: 'success', summary: 'Success', detail: 'Profile updated' });
            setIsLoading(false);
            setCurrentUser(res)
        })
        .catch(err => {
            Alert({ severity: 'error', summary: 'Error', detail: err });
        })
   

    }, []);

    return (
        <>
          <Toast className="text-sm" ref={toast} />
            <form className="[&_label]:!text-sm max-md:gap-6 col-span-3 row-start-2 row-span-full flex flex-col" id="profile-details-form" onSubmit={(e) => handleDefaultSubmit(e)}>
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
                            <label className="formLabel">Profile image</label>
                            <div className="mt-2">
                                <div className="formField">

                                <InputFileNoSSR defaultValue={profilePic} name={"profile_pic"} required={true}/>
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
                                        <input type="email" name="useremail" id="useremail" className="" placeholder="ex: johndoe@gmail.com" required/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="usermobile" className="formLabel">Mobile number</label>
                                <div className="mt-2">
                                    <div className="formField">
                                    <PhoneInput
                                        className="px-3"
                                        ref={phoneInputRef}
                                        name="usermobile"
                                        
                                        placeholder="Enter phone number"
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
                                <label htmlFor="logo_upload" className="formLabel">Clinic Logo</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <InputFileNoSSR defaultValue={clinicLogo} name={"clinic_logo"}/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="clinic_name" className="formLabel">Clinic Name</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="text" name="clinic_name" id="clinic_name" className="" placeholder="Clinic Name"/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="clinic_location" className="formLabel">Clinic location</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="text" name="clinic_location_state" id="clinic_location_state" className="" placeholder="State/Territory"/>
                                        <input type="text" name="clinic_location_country" id="clinic_location_country" className="" placeholder="Country"/>
                                        <input type="text" name="clinic_location_postcode" id="clinic_location_postcode" className="" placeholder="Postcode/Zipcode"/>
                                    </div>
                                </div>
                            </div>

                            <div className="">
                                <label htmlFor="clinic_established" className="formLabel">When was your clinic established?</label>
                                <div className="mt-2">
                                    <div className="formField">
                                        <input type="date" name="clinic_established" id="clinic_established" className=""/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
               
                   
                <div className="w-full flex flex-row justify-end md:items-end mt-10">
                    <Button className="btn-primary md:min-w-32" type="submit" loading={isLoading}><span>Save</span></Button>
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