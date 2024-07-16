"use client"

import ClinicQr from "@/components/clinic-qrcode";
import CopyButton from "@/components/copy-text-button";
import { InputText } from 'primereact/inputtext';
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useSessionContext } from "@/context/sessionContext";
import Link from "next/link";

export default function Page() {
    const {currentUser} = useSessionContext()
    const {data} = useSurveyDataContext()

    let clinicId = currentUser._id
    let url = `${process.env.NEXT_PUBLIC_DOMAIN}/survey/team?cid=${clinicId}`;

    let ownerSurveyDone = data?.ownerSurveyData ? Object.keys(data.ownerSurveyData).length > 0 : false

    return (
        <div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 grid grid-cols-3 grid-rows-6">
             <div className="card col-span-3 row-span-1 flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium">Team Survey</h1>
             </div>
            <div className="card col-span-3 row-span-5 p-20">
                {ownerSurveyDone && <div className="flex flex-row flex-wrap gap-20 justify-center mt-20">
                    <div className="flex flex-col items-center gap-5">
                        <ClinicQr text={url}/>
                        <p>Let your team scan the QR code</p>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-2 mt-auto mb-5">
                            <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                            <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`}/>
                        </div>
                        <p className="text-center text-sm text-neutral-400 mt-auto">* You can also include this link in your marketing emails.</p>
                        <p className="text-center ">Or share this link for them to visit</p>
                    </div>
                </div>
                }
                {!ownerSurveyDone &&
                    <div>
                       <span className="mr-2">To share the team survey link, please complete the owner survey first.</span> <Link className="inline-flex btn btn-primary " href="/dashboard/owner-survey">Owner survey</Link>
                    </div>
                }
                 
            </div>
        </div>
    );
}