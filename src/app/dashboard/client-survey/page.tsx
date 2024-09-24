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
import { formatDateTime, saveAsExcelFile } from "lib/helperFunctions";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { mobileNavbarHeight } from "lib/Const";
import UpgradePlanBlock from "components/upgrade-plan-block";
import { Tooltip } from "primereact/tooltip";
import { Button } from "primereact/button";
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs';

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
    const [isJourney,setIsJourney] = useState(isThisJourney)

    let clinicId = currentUser._id
    let url = `${process.env.NEXT_PUBLIC_DOMAIN}/survey/client?cid=${clinicId}`;

    let ownerSurveyDone = data?.ownerSurveyData ? Object.keys(data.ownerSurveyData).length > 0 : false

    let clientSurvey = data?.clientSurveyData
    let client_datatable_all: any[] | undefined = []
    if(clientSurvey){
        client_datatable_all =  clientSurvey.map((i,indx) => {
            return {
                'First Name': i.fname,
                'Last Name': i.lname,
                'Email': i.email,
                'Recommendation': i.recommendation,
                'Recommendation Feedback': i.recommendation_feedback,
                'Recommended Previously': i.recommendedPreviously,
                'Service Used': i.servicesUsed,
                'Satisfaction With Your practioner': i.practitioner,
                'Satisfaction With Our Admin Team': i.receptionTeam,
                'Look And Feel Of Our Practice': i.lookAndFeel,
                'Satisfaction With Our Communication': i.communication,
                'Satisfaction With Our Booking Process': i.bookingProcess,
                'Value For Money Of Your Treatment': i.valueForMoney,
                'Satisfaction With Our website': i.website,
                'Improvement Suggestion': i.improvementSuggestion,
                'Social Media used': i.socialMediaUsed,
                'Follow-up Appointment Booking Timeline': i.followUpBookingConfirmation,
                'Group Age': i.group_age,
                'Comments or Question':i.comments_questions,
                'Date': formatDateTime(i.createdAt)
            }
        })
    }


    function redirectTo(){
        router.push('/dashboard/client-survey')
        setIsJourney(false)
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

    let isRestricted = false
    if(currentUser.subscription_level == 0){
        isRestricted = true
    }

    const exportExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        // Assuming tableData is an array of objects
        worksheet.columns = Object.keys(client_datatable_all[0]).map(key => ({ header: key, key }));
      
        client_datatable_all.forEach(data => {
          worksheet.addRow(data);
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
      
        saveAsExcelFile(buffer, 'RMC_CLIENTS_REPORT_DATA.xlsx');
    };

    function exitJourney(){
        router.replace('/dashboard/client-survey')
        setIsJourney(false)
    }
    return (
        <div className="bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col">
             <div className="card flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium mr-4">Client Survey</h1>
                {!isRestricted && <ul className="flex-1 max-w-lg grid gap-[1px] grid-cols-2 divide-x *:cursor-pointer *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
                    <li onClick={()=> setShareSurveyView(true)} className={shareSurveyView ? '!bg-orange-400 text-white' : ''}>Share survey</li>
                    <li onClick={()=> setShareSurveyView(false)} className={!shareSurveyView ? '!bg-orange-400 text-white' : ''}>Survey data</li>
                </ul>}
             </div>

             {isRestricted && <div className="card flex-1 p-20 w-full">
                <div className="flex items-center flex-col gap-2 text-center">
                <UpgradePlanBlock/>
            </div>
                
            </div>}
            
                {!isRestricted && shareSurveyView && <> 
                    {isJourney ? (<div style={{maxHeight:`calc(100svh - ${mobileNavbarHeight})`}} className={`md:!max-h-full max-md:!z-[999] max-md:flex-col-reverse setupWrapper bg-black/50 left-0 top-0 fixed max-md:h-full md:h-screen setupWrapper w-screen z-10 p-5 md:p-10 flex gap-4`}>          
                        <div className="md:w-96 flex flex-col flex-nowrap -mb-10">
                            <div className="mt-auto relative bg-white w-fit rounded-2xl p-5 mx-auto space-y-4 after:content-[''] after:bg-red after:w-0 after:h-0 after:absolute after:border-solid after:border-[15px] after:border-transparent after:border-t-white after:top-full ">
                            <button className="absolute right-4 group" onClick={exitJourney}><span className="pi pi-times flex items-center justify-center text-lg text-gray-600 transform transition-transform duration-300 hover:scale-110 hover:text-red-400"></span></button>
                                <h1 className="inline-block text-lg font-bold">Finally, invite your clients to answer the survey.</h1>
                                
                                <p className="text-md text-gray-700">{`Select Client Survey from the option panel: Copy the Client Survey link. Create an email campaign using your email marketing software (e.g. Mailchimp, Active Campaign etc.). Add the link to a button in your email to help it stand out. Please send this to all clients that have visited your clinic in the last 12 months.`}</p>
                                <div className="w-full flex items-end">
                                    <button onClick={redirectTo} className="ml-auto btn btn-primary">Done</button>
                                </div>
                            </div>
                            
                            <Image
                                className="w-32 md:w-36  aspect-square" 
                                src="/images/logos/helper_avatar.png"
                                alt="recommendation avatar"
                                width={150}
                                height={150}
                            />
                        </div>


                            <div className="max-md:overflow-auto rounded-xl bg-white card flex-1 p-20">
                                {ownerSurveyDone && <>
                                <p className="text-md text-center text-gray-600">Please send this survey to all clients that visited your clinic in the last 12 months. We recommend offering a major prize of $200 to one lucky winner. To distribute the survey, we suggest using Mailchimp or similar to email. It may also be worthwhile creating a flyer with the QR code to display in your clinic to encourage more responses.</p>
                                <div className="flex flex-row flex-wrap gap-20 justify-center mt-20">
                                    <div className="flex flex-col items-center gap-5">
                                        <ClinicQr text={url}/>
                                        <p>Let your clients scan the QR code</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row gap-2 mt-auto mb-5">
                                            <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                                            <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`}/>
                                        </div>
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
                                <div className="flex flex-row gap-2 mt-auto mb-5">
                                    <InputText value={url} className="ring-1 text-xs p-2 flex-1" readOnly />
                                    <CopyButton className="!bg-appblue-300 !text-white hover:!bg-appblue-350 grid align-center px-4 gap-2 !ring-0 !flex flex-row" buttonText="Copy" textToCopy={`${url}`}/>
                                </div>
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
                
                
              {!isRestricted && !shareSurveyView && clientSurvey && <>
                <div>
                    <Tooltip target=".export-buttons>button" position="bottom" />
                    <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
                        <Button type="button" icon="pi pi-file-excel" className='bg-green-600 text-white p-2 w-fit aspect-square' onClick={exportExcel} data-pr-tooltip="XLS" />
                    </div>

                    <DataTable value={client_datatable_all} selectionMode="single" onSelectionChange={(e) => tableRowOnClick(e)} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort>
                        <Column field="First Name" header="First Name" sortable></Column>
                        <Column field="Last Name" header="Last Name" sortable></Column>
                        <Column field="Email" header="Email Add" sortable></Column>
                        <Column field="Date" header="Date" sortable></Column>
                    </DataTable>
                </div>
                <Dialog header={dialogHeaderText} visible={dialogVisible} style={{ width: 'min(90vw, 70rem)' }} onHide={() => {if (!dialogVisible) return; setDialogVisible(false); }}>
                    <div className="m-0">
                        <TableData data={dialogData}/>
                    </div>
                </Dialog>
                </>
                }
                

                
            
           
        

            
        </div>
    );
}