"use client"
import ClinicQr from "../../../components/clinic-qrcode";
import CopyButton from "../../../components/copy-text-button";
import { InputText } from 'primereact/inputtext';
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import Link from "next/link";
import { Column } from "primereact/column";
import { DataTable, DataTableSelectionSingleChangeEvent } from "primereact/datatable";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import TableData from "../../../components/table-data";
import { formatDateTime } from "@/helperFunctions";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page({searchParams}:{searchParams:any}) {
    const router = useRouter()
    const {currentUser} = useSessionContext()
    const {data} = useSurveyDataContext()
    const [shareSurveyView,setShareSurveyView] = useState(true)
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<Record<string,any> | null>(null)
    let dialogHeaderText = ""
    if(dialogData){
        dialogHeaderText = `${dialogData.fname} ${dialogData.lname}`
    }    
    let isThisJourney = searchParams.journey == "" ? true : false
    const [isJourney,setIsjourney] = useState(isThisJourney)

    let clinicId = currentUser._id
    let url = `${process.env.NEXT_PUBLIC_DOMAIN}/survey/client?cid=${clinicId}`;

    let ownerSurveyDone = data?.ownerSurveyData ? Object.keys(data.ownerSurveyData).length > 0 : false

    let clientSurvey = data?.clientSurveyData
    if(clientSurvey){
        clientSurvey.forEach(i => i.createdAt = formatDateTime(i.createdAt).replaceAll("/","-"))
    }

    function redirectTo(){
        router.push('/dashboard/client-survey')
        setIsjourney(false)
    }

    function tableRowOnClick(e: DataTableSelectionSingleChangeEvent<any[]>){
        let value = e.value
        delete value['_id']
        delete value['clinicid']
        delete value['updatedAt']
        delete value['__v']
        setDialogData(value)
        setDialogVisible(true)
    }

    return (
        <div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col overflow-scroll min-h-full max-h-[calc(100vh_-_4rem)]">
             <div className="card flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium">Client Survey</h1>
                <ul className="flex-1 max-w-lg grid gap-[1px] grid-cols-2 divide-x *:cursor-pointer *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
                    <li onClick={()=> setShareSurveyView(true)} className={shareSurveyView ? '!bg-orange-400 text-white' : ''}>Share survey</li>
                    <li onClick={()=> setShareSurveyView(false)} className={!shareSurveyView ? '!bg-orange-400 text-white' : ''}>Survey data</li>
                </ul>
             </div>
            
                {shareSurveyView && <> 
                    {isJourney ? (<div className="setupWrapper bg-black/50 left-0 top-0 fixed h-screen setupWrapper w-screen z-10 p-10 flex gap-4">          
                        <div className="w-96 flex flex-col flex-nowrap -mb-10">
                            <div className="mt-auto relative bg-white w-fit rounded-2xl p-5 mx-auto space-y-4 after:content-[''] after:bg-red after:w-0 after:h-0 after:absolute after:border-solid after:border-[15px] after:border-transparent after:border-t-white after:top-full ">
                                <h1 className="inline-block text-lg font-bold">Finally, invite your clients to answer the survey.</h1>
                                
                                <p className="text-md text-gray-700">{`Copy the Client Survey link. Create an email campaign to using your marketing software (Mailchimp, ActiveCampaign, etc) Add the link to the CTA/Button in your email. Send the email to all clients that visited your clinic in the last 12 months.`}</p>
                                <div className="w-full flex items-end">
                                    <button onClick={redirectTo} className="ml-auto btn btn-primary">Done</button>
                                </div>
                            </div>
                            
                            <Image
                                className="w-[150px] aspect-square" 
                                src="/images/logos/helper_avatar.png"
                                alt="recommendation avatar"
                                width={150}
                                height={150}
                            />
                        </div>


                            <div className="card flex-1 p-20">
                                {ownerSurveyDone && <>
                                <p className="text-md text-center text-gray-600">Please send this survey to all clients that visited your clinic in the last 12 months. We recommend offering a major prize of $200 to one lucky winner. To distribute the survey, we suggest using Mailchimp or similar to email. It may also be worthwhile creating a flyer with the QR code to display in your clinic to encourage more responses.</p>
                                <div className="flex flex-row flex-wrap gap-20 justify-center mt-20">
                                    <div className="flex flex-col items-center gap-5">
                                        <ClinicQr text={url}/>
                                        <p>Let your clients scan the QR code</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-2 mt-auto">
                                            <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                                            <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`}/>
                                        </div>
                                        <p className="mt-auto text-center text-sm text-neutral-400">* You can also include this link in your marketing emails.</p>
                                        <p className="text-center">Or share this link for them to visit</p>
                                    </div>
                                </div>
                                </>}


                                {!ownerSurveyDone &&
                                    <div>
                                    <span className="mr-2">To share the client survey link, please complete the owner survey first.</span> <Link className="inline-flex btn btn-primary " href="/dashboard/owner-survey">Owner survey</Link>
                                    </div>
                                }

                            </div>
                        </div>)
                        : (
                            <>
                            <div className="card flex-1 p-20">
                             {ownerSurveyDone && <>
                        <p className="text-md text-center text-gray-600">Please send this survey to all clients that visited your clinic in the last 12 months. We recommend offering a major prize of $200 to one lucky winner. To distribute the survey, we suggest using Mailchimp or similar to email. It may also be worthwhile creating a flyer with the QR code to display in your clinic to encourage more responses.</p>
                        <div className="flex flex-row flex-wrap gap-20 justify-center mt-20">
                            <div className="flex flex-col items-center gap-5">
                                <ClinicQr text={url}/>
                                <p>Let your clients scan the QR code</p>
                            </div>
                            <div className="flex flex-col">
                                <div className="flex flex-row gap-2 mt-auto">
                                    <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                                    <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`}/>
                                </div>
                                <p className="mt-auto text-center text-sm text-neutral-400">* You can also include this link in your marketing emails.</p>
                                <p className="text-center">Or share this link for them to visit</p>
                            </div>
                        </div>
                        </>}


                        {!ownerSurveyDone &&
                            <div>
                            <span className="mr-2">To share the client survey link, please complete the owner survey first.</span> <Link className="inline-flex btn btn-primary " href="/dashboard/owner-survey">Owner survey</Link>
                            </div>
                        }
                        </div>
                        </>
                        )
                        
                    } 

                   
                    </>
                }
                
                
              {!shareSurveyView && clientSurvey && <>
                <div>
                    <DataTable value={clientSurvey} selectionMode="single" onSelectionChange={(e) => tableRowOnClick(e)} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort>
                        <Column field="fname" header="First Name" sortable></Column>
                        <Column field="lname" header="Last Name" sortable></Column>
                        <Column field="email" header="Email Add" sortable></Column>
                        <Column field="createdAt" header="Date" sortable></Column>
                    </DataTable>
                </div>
                <Dialog header={dialogHeaderText} visible={dialogVisible} style={{ width: '50vw' }} onHide={() => {if (!dialogVisible) return; setDialogVisible(false); }}>
                    <div className="m-0">
                        <TableData data={dialogData}/>
                    </div>
                </Dialog>
                </>
                }
                

        
            
           
        

            
        </div>
    );
}