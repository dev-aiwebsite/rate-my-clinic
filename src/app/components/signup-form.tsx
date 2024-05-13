"use client"
import { RegisterUser } from "@/server-actions";
import Link from "next/link";


export default function SignupForm() {
    return (
        <form action={RegisterUser} className="flex flex-col gap-6">
            <div>
                <label className="text-xs text-neutral-400"
                    htmlFor="username">Name</label>
                <input className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350"
                 type="text" name="username" id="username"/>
            </div>
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
                <label className="text-xs text-neutral-400"
                    htmlFor="clinic_type">Clinic type</label>
              <select id="clinic_type" name="clinic_type"  className="block w-full bg-transparent ring-1 ring-gray-400 border-none rounded-md px-4 py-2 hover:ring-appblue-350 focus:ring-appblue-350 active:ring-appblue-350">
                    <option value="GP">General Practitioner (GP) Clinic</option>
                    <option value="Dental">Dental Clinic</option>
                    <option value="Community">Community Health Clinic</option>
                    <option value="Mental">Mental Health Clinic</option>
                    <option value="Specialist">Specialist Clinic</option>
              </select>
            </div>
            <div>
                <button
                    className="border-none w-full block bg-appblue-300 text-white rounded-md px-4 py-2 hover:shadow-lg cursor-pointer transition-all duration-300 hover:bg-appblue-350"
                type="submit">Submit</button>
            </div>
            <div className="flex flex-row justify-between">
                <Link className="underline text-xs text-blue-600 text-center mx-auto"
                    href="/login">Already a member? Login here
                </Link>
            </div>
        </form>
    );
}