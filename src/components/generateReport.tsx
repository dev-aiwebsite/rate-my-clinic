"use client"
import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CircleChart from 'components/circle-chart';
import MeterChart from './meter-chart';
import NpsContent from './nps-recommendation';
import { useSurveyDataContext } from '@/context/surveyDataContext';
import { useSessionContext } from '@/context/sessionContext';
import AppAcess from 'lib/appAccess';
import { Button } from 'primereact/button';
import DialogConfirm from './confirm-dialog';
import AppDialog from './dialog';
import { ProgressBar } from 'primereact/progressbar';
import { throttle } from 'lodash';
import { useMediaQuery } from 'react-responsive';
import { createReportHtml } from 'lib/createReportHtml';

type Tparams = {
    clinicId: string
}
const GenerateReport = (report:any) => {
    const captureRef = useRef<HTMLDivElement>(null);
    const {currentUser} = useSessionContext()
    const reportToUse = currentUser?.reportToUse
    const [showDialog, setShowDialog] = useState(false);
    const reports = currentUser.reports
    // if(!report){
    //     if(currentUser.reports.length){
            
    //         if(reportToUse){
    //             report = currentUser.reports[reportToUse]
    //         } else {
    //             report = currentUser.reports[0]
    //         }
    //     }
       
    // }

    if(reports.length){
        report = reports[reports.length - 1]
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


    const handleCloseDialog = () => {
        setShowDialog(false);
      };

      

      
      useEffect(()=>{
        if(reportHtml || !reportData) return
        const renderReport = async () => {
            const pdfHtml = await createReportHtml(reportData)
            // document.querySelector('.report_wrapper').innerHTML = pdfHtml
            setReportHtml(pdfHtml)
        }
        renderReport()
    },[])

    
    // if(isMobile){
    //     <>
    //         <AppDialog position='top' setIsVisible={handleCloseDialog} header={'Download Report'}>
    //             <div className='!select-none'>
    //                 <p>Unable to generate the report as the file size exceeds the limits for mobile devices. Please use a desktop computer to generate the report.</p>
    //                 {/* <a className='select-none block mx-auto text-center mt-10 text-white btn bg-red-400 hover:bg-red-500' href={pdfUrl} download={`${pdfFileName}`} target='_blank'>{`${pdfFileName}`}</a> */}
    //             </div>
    //         </AppDialog>
    //     </>
    // }

    return (
        <div className={`h-full md:h-[80vh]  bg-gray-200 p-2 md:p-10 rounded-lg ${loading ? 'overflow-hidden' : 'overflow-scroll'}`}>
            {/* {isMobile && <AppDialog isVisible={showDialog} setIsVisible={handleCloseDialog} header={'Download Report'}>
                <div className='!select-none'>
                    <p>Unable to generate the report as the file size exceeds the limits for mobile devices. Please use a desktop computer to generate the report.</p>
                </div>
            </AppDialog>
             } */}
            
           {pdfUrl && <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="btn sticky left-full top-0 z-10 right-2 bg-red-500 text-white font-bold" onClick={handleGeneratePDF} download={pdfFileName}>Download</a>}
            <div className="report_wrapper" dangerouslySetInnerHTML={{ __html: reportHtml || '' }}>
            </div>

            
        </div>
    );
};

export default GenerateReport;
