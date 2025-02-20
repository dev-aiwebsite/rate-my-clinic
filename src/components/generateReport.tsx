"use client"
import React, { useEffect, useState } from 'react';
import { useSessionContext } from '@/context/sessionContext';
import AppAcess from 'lib/appAccess';
import { throttle } from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { createReportHtml } from 'lib/createReportHtml';
import { ReportData } from './ReportsSections';

type Tparams = {
    clinicId: string
}
const GenerateReport = ({reportId,report}:{reportId?:string, report?:ReportData}) => {
    const {currentUser} = useSessionContext()
    const reports = currentUser.reports

    if(!report){
        if(reports.length){
            report = reports[reports.length - 1]
        }
    }
   
    console.log(currentUser)
    console.log(report)
    let reportData = {}
    let pdfLink = ""
    if(report){
        reportData = JSON.parse(report.data)
        pdfLink = report.pdf_link
    }
    

    const [pdfUrl, setPdfUrl] = useState(pdfLink);
    const [pdfFileName, setPdfFileName] = useState(`rmc_${pdfUrl.split('/')[2]}`);
    const [pdfProgress, setPdfProgress] = useState(0);
    const [loadingText, setLoadingText] = useState('Generating pdf');
    const [reportHtml,setReportHtml] = useState<string | null | false>(null)
    const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

    const throttledSetProgress = throttle((value) => setPdfProgress(value), 500);
    const [loading, setLoading] = useState<boolean>(false);

    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let enabled = userAccess?.charts || ['strategy','finance']

    const handleGeneratePDF = async () => {

    };
    
      
      useEffect(()=>{
        if(reportHtml || !reportData) return
        const renderReport = async () => {
            const pdfHtml = await createReportHtml(reportData)
            setReportHtml(pdfHtml)
        }
        renderReport()
    },[])

    return (
        <div className={`h-full md:h-[80vh]  bg-gray-200 p-2 md:p-10 rounded-lg ${loading ? 'overflow-hidden' : 'overflow-scroll'}`}>
            
           {pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn sticky left-full top-0 z-10 right-2 bg-red-500 text-white font-bold" onClick={handleGeneratePDF} download={pdfFileName}>Download</a>}
            <div className="report_wrapper" dangerouslySetInnerHTML={{ __html: reportHtml || '' }}>
            </div>

            
        </div>
    );
};

export default GenerateReport;
