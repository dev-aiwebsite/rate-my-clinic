"use client"
import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CircleChart from 'components/circle-chart';
import MeterChart from './meter-chart';
import NpsContent from './nps-recommendation';
import { useSurveyDataContext } from '@/context/surveyDataContext';
import { useSessionContext } from '@/context/sessionContext';
import AppAcess from 'lib/appAccess';
import { Button } from 'primereact/button';
import html2pdf from 'html2pdf.js';
import { image } from 'html2canvas/dist/types/css/types/image';

type Tparams = {
    clinicId: string
}
const GenerateReport = () => {
    const captureRef = useRef<HTMLDivElement>(null);
    const allData = useSurveyDataContext()
    const {currentUser} = useSessionContext()
    const surveyData = allData.data

    const [loading, setLoading] = useState<boolean>(false);

    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let enabled = userAccess?.charts || ['strategy','finance']

    console.log(surveyData,enabled)

    let clinicName = surveyData?.ownerSurveyData?.clinic_name

    let overAll = [
        {
            name: 'Group A',
            value: surveyData?.overalls?.mine || 0,
            color: '#94BDE5',
        },
        {
            name: 'Average Australian Clinic',
            value: surveyData?.overalls?.other || 0,
            color: '#004261',
        },
    ]

    let diff = overAll[0].value - overAll[1].value
    let sign = diff > 0 ? '+' : ''
    let subtext = {
        text: `${sign}${diff.toFixed(1)}`,
        class: 'text-red-400 text-[10px]'
    }


    const handleGeneratePDF = async () => {
        setLoading(true)
        if (captureRef.current) {
            try {
                const pdf = new jsPDF('p', 'mm', 'letter');
                const pageHeight = pdf.internal.pageSize.getHeight();
                let position = 0;
              

                // // pdf.textWithLink('Click here to visit Google', 10, 10, {
                // //     url: 'https://www.google.com/',
                // //     color: [0, 0, 255], // Blue color for the link
                // //     underline: true // Optional: underline the text
                // // });
              
    



                    const elements = document.querySelectorAll('.pdf_page');

                    for (let i = 0; i < elements.length; i++) {
                        const element = elements[i] as HTMLElement;
        
                        // Capture each element as an image
                        const canvas = await html2canvas(element, { scale: 3 });
                        const imgData = canvas.toDataURL('image/png');
                        const imgProps = pdf.getImageProperties(imgData);
                        const pdfWidth = pdf.internal.pageSize.getWidth();
                        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        
                        if (position + pdfHeight > pageHeight) {
                            pdf.addPage();
                            position = 0;
                        }
        
                        // Add image to PDF
                        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                        position += pdfHeight;
                    }
                
                
                pdf.save(`RMC Report - ${clinicName}.pdf`);
                setLoading(false)
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        } else {
            console.error('Capture reference is null');
        }
    };


    const data = [
        {
            name: 'Clients',
            value: surveyData?.summary?.clients?.score || 0,
            color: 'var(--appgreen-300)',
            icon: '/icons/client.svg',
            isEnabled: enabled.includes('clients')
        },
        {
            name: 'Strategy',
            value: surveyData?.summary?.strategy?.score || 0,
            color: 'var(--appgreen-300)',
            icon: '/icons/strategy.svg',
            isEnabled: enabled.includes('strategy')
        },
        {
            name: 'Teams',
            value: surveyData?.summary?.team?.score || 0,
            color: 'var(--appblue-200)',
            icon: '/icons/team.svg',
            isEnabled: enabled.includes('teams')
        },
        {
            name: 'Finance',
            value: surveyData?.summary?.finance?.score || 0,
            color: 'var(--appblue-200)',
            icon: '/icons/finance.svg',
            isEnabled: enabled.includes('finance')
        },
    ]

    let npsContentItemsDefault = [
        [
            {
                name: 'Clients',
                value: surveyData.summary.clients.score,
                color: 'var(--appgreen-300)',
                icon: "",
            },
            {
                name: 'other',
                value: Number(surveyData.other_summary.clients.score.toFixed(1)),
                color: 'var(--appgreen-300)',
                icon: "",
            }
        ],
        [
            {
                name: 'Finance',
                value: surveyData.summary.finance.score,
                color: 'var(--appgreen-300)',
                icon: "",
            },
            {
                name: 'other',
                value: Number(surveyData.other_summary.finance.score.toFixed(1)),
                color: 'var(--appgreen-300)',
                icon: "",
            }
        ],
        [
            {
                name: 'Strategy',
                value: surveyData.summary.strategy.score,
                color: 'var(--appgreen-300)',
                icon: "",
            },
            {
                name: 'other',
                value: Number(surveyData.other_summary.strategy.score.toFixed(1)),
                color: 'var(--appgreen-300)',
                icon: "",
            }
        ],
        [
            {
                name: 'Team',
                value: surveyData.summary.team.score,
                color: 'var(--appgreen-300)',
                icon: "",
            },
            {
                name: 'other',
                value: Number(surveyData.other_summary.team.score.toFixed(1)),
                color: 'var(--appgreen-300)',
                icon: "",
            }
        ]

    ]

    const npsContentItems = npsContentItemsDefault.filter(subArray =>
        subArray.some(item => enabled.includes(item.name.toLowerCase()))
    );

    
    let clientNps = {
        score: Number(surveyData.summary.clients.nps) / 30,
        quality: getQuality(Number(surveyData.summary.clients.nps) / 30)
    }
   
    let teamSatisfactionArray= surveyData.teamSurveyData.map(i => i.recommendation)
    let teamSatisfaction = Number((teamSatisfactionArray.reduce((a,b) => a + b, 0) / teamSatisfactionArray.length).toFixed(1))
    let teamNps = {
        score:teamSatisfaction,
        quality: getTeamQuality(teamSatisfaction)
    }
    function getQuality(score:number) {
        if (score <= 70) {
            return "low";
        } else if (score <= 80) {
            return "fair";
        } else if (score <= 90) {
            return "very good";
        } else {
            return "excellent";
        }
    }

    function getTeamQuality(score:number) {
        if (score < 80) {
            return "low";
        } else if (score <= 9) {
            return "good";
        } else {
            return "great";
        }
    }

    return (
        <div className='bg-gray-200 p-10 rounded-lg'>
            <Button className="btn sticky left-full top-2 right-2 bg-red-500 text-white" label="Download pdf" icon="" loading={loading} onClick={handleGeneratePDF} />
            <div id='contentToPrint' ref={captureRef} className='*:w-[215.9mm] *:px-[15mm] *:py-[10mm] w-fit bg-white space-y-[15mm] mx-auto' >
                <div
                className='pdf_page p-[15mm] w-[215.9mm]'>
                    <img className='block mx-auto w-[70mm]' src="/images/logos/rmc-logo.png" alt=""></img>
                    <div className="!pb-8 font-[300] flex flex-col items-center justify-center gap-5">
                    <div className='*:!max-w-full w-[65mm] *:text-[5mm]'>
                            <CircleChart data={overAll} subtext={subtext} />
                    </div> 
                        <div>
                            <div className="flex flex-row gap-[6mm] items-center">
                                <div className="h-[6mm] w-[6mm] bg-appblue-300"></div>
                                <span className="text-[7mm]">Overall Rating: {overAll[0].value ? overAll[0].value.toFixed(1) : "-/-"}</span>
                            </div>
                            <div className="flex flex-row gap-[6mm] items-center">
                                <div className="h-[6mm] w-[6mm] bg-appblue-400"></div>
                                <span className="text-[4.5mm]">Average Australian Clinic: {overAll[1].value.toFixed(1)}</span>
                            </div>
                        </div>
                    </div>
                    <div className='border-solid border-b-2 border-gray-200 w-full'></div>
                    <div className='w-[140mm] mx-auto grid grid-cols-4 gap-6 px-6 mt-[10mm]'>
                        {data.map((item: any, index: any) => {
                            let isEnabled = item.isEnabled
                            if (!isEnabled) {
                                item.value = 0
                            }
                            return (
                                <div key={index} className={`${!isEnabled ? 'disabled' : ""} grid grid-cols-1 items-center justify-center`}>
                                    <div className="flex-1 [&_*]:text-xs">
                                        <MeterChart
                                            data={[
                                                {
                                                    value: 100,
                                                    color: item.color,
                                                },
                                            ]}
                                            needle={{
                                                color: "",
                                                value: item.value,
                                                title: item.name
                                            }}
                                        />
                                        <p className="text-center text-sm font-medium">{item?.value || "-/-"}</p>
                                    </div>

                                </div>
                            )
                        })}
                    </div>
                    <div className='font-[300] space-y-4 mt-[10mm]'>
                        <h1 className='text-[8mm]'>Overview</h1>
                        <p className='text-[4.5mm] text-neutral-500'>
                            <span className='font-medium'>{clinicName}</span> is a successful clinic by some metrics. There are however, areas to improve. Our aim in this report is to break down each section that we rated and provide various recommendations on how you can improve your rating.
                        </p>
                    </div>
                    <div className='text-[4.5mm] mt-[10mm]'>
                        <h1 className='font-medium'>Key points include:</h1>
                        <ul className='font-[300] text-neutral-500 list-disc p-4'>
                            <li>Your client NPS of {clientNps.score.toFixed(1)} is {clientNps.quality}</li>
                            <li>Your team satisfaction was {teamNps.score} out of 10 which is {teamNps.quality}</li>
                            {/* <li>Your passive net profit % is (lower, at par, higher) than the national average</li> */}
                        </ul>
                    </div>
                </div>
                

                {npsContentItems.map((item, index) =>
                    <div key={index} className='pdf_page p-[15mm] w-[215.9mm] !mt-[20mm] [&_>_*_>_*:nth-child(1)]:flex-col [&_>_*_>_*:nth-child(1)]:items-start [&_>_*_>_*:nth-child(1)]:!gap-[15mm] [&_>_*_>_*:nth-child(1)_>_*:nth-child(1)]:!max-w-full [&_>_*_>_*:nth-child(1)_>_*:nth-child(2)]:!gap-6 [&_>_*_>_*:nth-child(2)_*]:!text-[4.5mm] [&_>_*_>_*:nth-child(2)_ul]:font-[300] [&_>_*_>_*:nth-child(2)_ul]:text-neutral-500'>
                        <NpsContent surveyData={surveyData} item={item} />
                    </div>

                )}





            </div>

            
        </div>
    );
};

export default GenerateReport;
