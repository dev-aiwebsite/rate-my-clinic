"use client"

import ClinicQr from "../../../components/clinic-qrcode";
import CopyButton from "../../../components/copy-text-button";
import { InputText } from 'primereact/inputtext';
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { useSessionContext } from "@/context/sessionContext";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mobileNavbarHeight } from "lib/Const";
import UpgradePlanBlock from "components/upgrade-plan-block";
import TeamDataTable from "components/team-datatable";
import AppAcess from "lib/appAccess";

export default function Page({ searchParams }: { searchParams: any }) {
    const router = useRouter()
    const { currentUser } = useSessionContext()
    const { data } = useSurveyDataContext()
    const [shareSurveyView, setShareSurveyView] = useState(true)

    let defaultisJourney = searchParams.journey == "" ? true : false
    const [isJourney, setIsJourney] = useState(defaultisJourney);

    let clinicId = currentUser._id
    let url = `${process.env.NEXT_PUBLIC_DOMAIN}/survey/team?cid=${clinicId}`;

    let ownerSurveyDone = data?.ownerSurveyData ? Object.keys(data.ownerSurveyData).length > 0 : false


    function redirectTo() {
        router.push('/dashboard/client-survey?journey')
    }

    let teamSurvey = data?.teamSurveyData

    const appAccess = AppAcess(currentUser.subscription_level || 0)
    let isRestricted = true 
    const teamSurveyAccess = appAccess.team_surveys
    if(teamSurveyAccess == Infinity || teamSurveyAccess > 0){
        isRestricted = false
    }

    function exitJourney() {
        router.replace('/dashboard/team-survey')
        setIsJourney(false)
    }

    return (
        <div className="max-md:!max-w-[100vw] bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col h-full">
            <div className="card col-span-3 row-span-1 flex flex-row gap-5 items-center justify-between">
                <h1 className="text-xl font-medium mr-4">Team Survey</h1>
                {!isRestricted && <ul className="flex-1 max-w-lg grid gap-[1px] grid-cols-2 divide-x *:cursor-pointer *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
                    <li onClick={() => setShareSurveyView(true)} className={shareSurveyView ? '!bg-orange-400 text-white' : ''}>Share survey</li>
                    <li onClick={() => setShareSurveyView(false)} className={!shareSurveyView ? '!bg-orange-400 text-white' : ''}>Survey data</li>
                </ul>}
            </div>
            {isRestricted && <div className="card flex-1 p-20 w-full">
                <div className="flex items-center flex-col gap-2 text-center">
                    <UpgradePlanBlock />
                </div>

            </div>}

            {!isRestricted && shareSurveyView && <>
                {isJourney ? (<div style={{ maxHeight: `calc(100svh - ${mobileNavbarHeight})` }} className={`md:!max-h-full max-md:!z-[999] max-md:flex-col-reverse setupWrapper bg-black/50 left-0 top-0 fixed max-md:h-full md:h-screen setupWrapper w-screen z-10 p-5 md:p-10 flex gap-4`}>
                    <div className="max-md:text-sm md:w-96 flex flex-col flex-nowrap -mb-10">
                        <div className="mt-auto relative bg-white w-fit rounded-2xl p-5 mx-auto space-y-4 after:content-[''] after:bg-red after:w-0 after:h-0 after:absolute after:border-solid after:border-[15px] after:border-transparent after:border-t-white after:top-full ">
                            <button className="absolute right-4 group" onClick={exitJourney}><span className="pi pi-times flex items-center justify-center text-lg text-gray-600 transform transition-transform duration-300 hover:scale-110 hover:text-red-400"></span></button>
                            <h1 className="inline-block md:text-lg font-bold">Next, Invite your team to answer the survey</h1>

                            <p className="md:text-md text-gray-700">{`Select Team Survey from the option panel: have your team scan the QR code or copy the link and distribute it via your preferred communication channel (email, messenger, etc)`}</p>
                            <div className="w-full flex items-end">
                                <button onClick={redirectTo} className="ml-auto btn btn-primary">Next</button>
                            </div>
                        </div>

                        <Image
                            className="w-32 md:w-36 aspect-square"
                            src="/images/logos/helper_avatar.png"
                            alt="recommendation avatar"
                            width={150}
                            height={150}
                        />

                    </div>
                    <div className="max-md:overflow-auto rounded-xl bg-white card flex-1 p-20 ">
                        {ownerSurveyDone && <>
                            <div className="flex flex-row flex-wrap gap-20 justify-center md:mt-20">
                                <div className="flex flex-col items-center gap-5">
                                    <ClinicQr text={url} />
                                    <p>Let your team scan the QR code</p>
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2 mt-auto mb-5">
                                        <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                                        <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`} />
                                    </div>
                                    <p className="text-center ">Or share this link for them to visit</p>
                                </div>
                            </div>
                        </>}
                        {!ownerSurveyDone &&
                            <div>
                                <span className="mr-2">To share the team survey link, please complete the owner survey first.</span> <Link className="inline-flex btn btn-primary " href="/dashboard/owner-survey">Owner survey</Link>
                            </div>
                        }

                    </div>

                </div>)
                    : (
                        <>
                            <div className="card flex-1 p-20">
                                {ownerSurveyDone && <div className="flex flex-row flex-wrap gap-20 justify-center mt-20">
                                    <div className="flex flex-col items-center gap-5">
                                        <ClinicQr text={url} />
                                        <p>Let your team scan the QR code</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-2 mt-auto mb-5">
                                            <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                                            <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`} />
                                        </div>
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
                        </>
                    )
                }
            </>
            }
            {!isRestricted && !shareSurveyView && teamSurvey && <>
               <div className="card">
                <TeamDataTable teamSurveyData={teamSurvey} />
                </div> 
            </>
            }

        </div>
    );
}

