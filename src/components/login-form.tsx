"use client"
import { AuthenticateUser } from "lib/server-actions";
import Link from "next/link";
import { useRef, useState } from "react";
import LoginSubmitBtn from "./login-submit-btn";
import { revalidatePath } from "next/cache";
import { useRouter } from 'next/navigation'

export default function LoginForm() {
    const formRef = useRef<HTMLFormElement>(null)
    const [error, setError] = useState(false)
    const router = useRouter()
    return (
        <form action={async (formdata) => {
            formRef.current?.reset()
            const res = await AuthenticateUser(formdata)
            if(res) {
                router.push('/dashboard')
            } else {
                console.log('Wrong credentials')
                setError(true)
            }
            
             
           
        }}
        ref={formRef}
        className="flex flex-col gap-6">
            {error && <span className="rounded bg-red-200 bg-opacity-50 ring-red-400 text-center px-4 py-2 text-red-500 text-xs">Wrong credentials</span>}
            <div>
                <label className="text-xs text-neutral-400"
                    htmlFor="useremail">Email Address</label>
                <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                 type="email" name="useremail" id="useremail"/>
            </div>
            <div>
                <label className="text-xs text-neutral-400"
                    htmlFor="userpass">Password</label>
                <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                type="password" name="userpass" id="userpass"/>
            </div>
            <div>
              <LoginSubmitBtn/>
            </div>
            <div className="flex flex-col max-md:items-center gap-2 md:flex-row justify-between">
                <Link className="underline text-xs text-blue-600"
                    href="/forgot-password">Forgot Password
                </Link>
                <Link className="underline text-xs text-blue-600"
                    href="/signup">Not yet a member? Register here
                </Link>
            </div>
        </form>
    );
}