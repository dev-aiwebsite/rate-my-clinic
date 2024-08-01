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

export default function Page() {

    
    const {currentUser} = useSessionContext()
    const {data} = useSurveyDataContext()
    const [shareSurveyView,setShareSurveyView] = useState(true)
    const [dialogVisible, setDialogVisible] = useState<boolean>(false);
    const [dialogData, setDialogData] = useState<Record<string,any> | null>(null)
    let dialogHeaderText = ""
    if(dialogData){
        dialogHeaderText = `${dialogData.fname} ${dialogData.lname}`
    }    

    let clinicId = currentUser._id
    let url = `${process.env.NEXT_PUBLIC_DOMAIN}/survey/client?cid=${clinicId}`;

    let ownerSurveyDone = data?.ownerSurveyData ? Object.keys(data.ownerSurveyData).length > 0 : false

    let clientSurvey = data?.clientSurveyData
    if(clientSurvey){
        clientSurvey.forEach(i => i.createdAt = formatDateTime(i.createdAt).replaceAll("/","-"))
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
            <div className="card flex-1 p-20">
                {shareSurveyView && <>

                
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
        </div>
    );
}