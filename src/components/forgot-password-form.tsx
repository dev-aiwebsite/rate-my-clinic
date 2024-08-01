"use client"
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { fetchData } from "../lib/data";

export default function ForgotPasswordForm({isPasswordResetValid,userEmail}:{isPasswordResetValid:boolean,userEmail:string}) {
    const formRef = useRef<HTMLFormElement>(null)
    const [emailSent, setEmailSent] = useState(null)
    const [loading, setLoading] = useState(false)


    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setLoading(true)
        try {
            if(!formRef.current) return
            const formdata = new FormData(formRef.current);
            const formdataObject = Object.fromEntries(formdata.entries());
            console.log(formdataObject);

            const response = await fetch('api/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formdataObject)
            });
            const res = await response.json();
            console.log(res);
            setEmailSent(res.success);
            if(res.success){
                formRef.current?.reset();
            }
            setLoading(false)
        } catch (err) {
            console.log(err);
        }
    };

    let successMessage = 'Password reset link sent'
    let errorMessage = 'Invalid credentials'
    let actionType = 'reset_link'
    let formFields = () => {
        return <div>
        <label className="text-xs text-neutral-400"
            htmlFor="useremail">Email Address</label>
        <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
        type="email" name="useremail" id="useremail"/>
    </div>
    }

    if(isPasswordResetValid){
        successMessage = 'Password successfully saved'
        errorMessage = 'Something went wrong'
        actionType = 'reset_password'
        formFields = ()=> {
            return <div>
                    <input type="hidden" name="useremail" value={userEmail}/>
                    <label className="text-xs text-neutral-400"
                        htmlFor="userpass">New password</label>
                    <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                    type="text" name="userpass" id="userpass"/>
                </div>
            
        }
    }

    return (
            <>
                <form onSubmit={handleSubmit} ref={formRef}
                className="flex flex-col gap-6">
                    <input type="hidden" name="action" value={actionType}/>
                    {emailSent && <Message severity="success" text={successMessage} />}
                    {emailSent === false && <Message severity="error" text={errorMessage} />}
                    {formFields()}
                    <div>

                    <Button loading={loading} className="border-none w-full block bg-appblue-300 text-white rounded-md px-4 py-2 hover:shadow-lg cursor-pointer transition-all duration-300 hover:bg-appblue-350" label="Submit" type="submit"/>
                    </div>
                    <div className="flex flex-row justify-between">
                        <Link className="underline text-xs text-blue-600"
                            href="/login">Login here
                        </Link>
                        <Link className="underline text-xs text-blue-600"
                            href="/pricing">Not yet a member? Register here
                        </Link>
                    </div>
                </form>
            </>
    );
}
