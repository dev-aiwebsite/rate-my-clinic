"use client"

import { formatDateTime} from "lib/helperFunctions"
import CustomDataTable from "./datatable";
import { useSessionContext } from "@/context/sessionContext";
import { Fragment, useEffect, useState } from "react";
import { DataTableRowClickEvent } from "primereact/datatable";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { IoIosArrowRoundBack } from "react-icons/io";
import GenerateReport from "./generateReport";
import { SaveReport } from "lib/generateReportData";

export type ReportData = {
    name: string;
    date: string;
    pdf_link:string;
    _id: string;
    data: string;
}

type ReportsSection = {
    defaultReportData?: ReportData;
}

const ReportsSection = ({defaultReportData}:ReportsSection) => {
    const {currentUser} = useSessionContext()
    const [selectedReport, setSelectedReport] = useState<ReportData | undefined>(undefined)

    function handleOnRowClick(e:DataTableRowClickEvent){
        
        const reportId = e.data.id
        const report = currentUser.reports.find((r:ReportData) => r._id == reportId)
        console.log(reportId, 'row click reportId')
        if(report){
            setSelectedReport(report)
        }
    }

    useEffect(()=>{
        setSelectedReport(defaultReportData)
    },[defaultReportData])


    const tableOptions = {
        userId: currentUser._id
    }

    return (<>
        <ReportViewer reportData={selectedReport} />
        <div>
            <ReportTable options={tableOptions} onRowClick={handleOnRowClick} data={currentUser.reports} />
        </div>
        </>
    );
}

export default ReportsSection;


export function ReportTable({data,options,onRowClick}:{onRowClick?:(e:DataTableRowClickEvent)=>void; data:ReportData[]; options?:{[key:string]:any}}) {
    let dataTable_all: any[] = []
    const [tableData,setTableData] = useState(data)
    if(tableData){
        dataTable_all =  tableData.map( i => {
            return {
                'id':i._id,
                'Name': i.pdf_link.split("/").at(-1),
                'Date': formatDateTime(new Date(i.date)),
            }
        })
    }



    const tableOptions = {
        'delete':{
            "enabled":true,
            "db_name":'reports',
            "userId": options?.userId
        },
        "updateData": (newData: any) => {setTableData(newData)},
        "data":tableData,
        export: {
            excel:false
        },
        onRowClick
    }

        return <>
                 <CustomDataTable datatable={dataTable_all} options={tableOptions}/>
        </>
}


type ReportViewer = {
    reportData?: ReportData;
}
const ReportViewer = ({reportData}:ReportViewer) => {
    const [isShown, setIsShown] = useState(false)

    function closeModal() {
        setIsShown(false)
        }
    
        useEffect(()=>{
            if(reportData){
                setIsShown(true)
            }
        },[reportData])

        console.log(reportData, 'reportData')
    if(!reportData) return
    return <Transition appear show={isShown} as={Fragment}>
    <Dialog as="div" className="max-md:!max-h-[calc(100svh_-_3.5rem)] relative z-10" onClose={closeModal}>
        <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <div className="max-md:!max-h-[calc(100svh_-_3.5rem)] fixed inset-0 bg-black/25"/>
        </TransitionChild>

        <div className="max-md:!max-h-[calc(100svh_-_3.5rem)] fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full md:items-center md:justify-center p-2 md:p-4 text-center">
            <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
            >
                <DialogPanel className="overflow-y-hidden w-full max-w-[70rem] max-h-[90vh] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                    as="h3"
                    className="sticky top-0 text-lg font-medium leading-6 text-gray-900"
                >
                <button className='bg-none' onClick={closeModal}>
                    <IoIosArrowRoundBack size={24} />
                    </button>
                </DialogTitle>
              
                    <GenerateReport report={reportData}/>
              
                </DialogPanel>
            </TransitionChild>
            </div>
        </div>
    </Dialog>
</Transition>
}