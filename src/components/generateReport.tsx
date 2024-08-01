"use client"
import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import CircleChart from 'components/circle-chart';
import MeterChart from './meter-chart';
import NpsContent from './nps-recommendation';
import { useSurveyDataContext } from '@/context/surveyDataContext';
import { useSessionContext } from '@/context/sessionContext';
import AppAcess from 'lib/appAccess';

type Tparams = {
    clinicId: string
}
const GenerateReport = () => {
    const captureRef = useRef<HTMLDivElement>(null);
    const allData = useSurveyDataContext()
    const {currentUser} = useSessionContext()
    const surveyData = allData.data

    const userAccess = AppAcess(Number(currentUser.subscription_level) || 0)
    let enabled = userAccess?.charts || ['strategy','finance']

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
        if (captureRef.current) {
            try {
                // Ensure the HTML content is correctly captured
                const canvas = await html2canvas(captureRef.current, {
                    scale: 3,
                });

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                const pageHeight = pdf.internal.pageSize.getHeight();
                let heightLeft = pdfHeight;
                let position = 0;
              
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                heightLeft -= pageHeight;
              
                while (heightLeft >= 0) {
                  position = heightLeft - pdfHeight;
                  pdf.addPage();
                  pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
                  heightLeft -= pageHeight;
                }

                // pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`RMC Report - ${clinicName}.pdf`);
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

    const npsContentItems = [
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


    return (
        <div className='bg-gray-200 p-10 rounded-lg'>
            <button type="button" className='btn sticky left-full top-2 right-2 bg-red-400 text-white' onClick={handleGeneratePDF}>Download Report</button>
            <div className='bg-white w-[210mm] space-y-[15mm] p-[15mm] mx-auto' ref={captureRef}>
                <img className='block mx-auto w-[80mm]' src="/images/logos/rmc-logo.png" alt=""></img>
                <div className="!pb-8 font-[300] flex flex-col items-center justify-center gap-5">
                   <div className='*:!max-w-full w-[65mm] *:text-[5mm]'>
                        <CircleChart data={overAll} subtext={subtext} />
                   </div> 
                    <div>
                        <div className="flex flex-row gap-[6mm] items-center">
                            <div className="h-[6mm] w-[6mm] bg-appblue-300"></div>
                            <span className="text-[9mm]">Overall Rating: {overAll[0].value ? overAll[0].value.toFixed(1) : "-/-"}</span>
                        </div>
                        <div className="flex flex-row gap-[6mm] items-center">
                            <div className="h-[6mm] w-[6mm] bg-appblue-400"></div>
                            <span className="text-[5mm]">Average Australian Clinic: {overAll[1].value.toFixed(1)}</span>
                        </div>
                    </div>
                </div>
                <div className='border-solid border-b-2 border-gray-200 w-full'></div>
                <div className='grid grid-cols-4 gap-6 px-6'>
                    {data.map((item: any, index: any) => {
                        let isEnabled = item.isEnabled
                        if (!isEnabled) {
                            item.value = 0
                        }
                        return (
                            <div key={index} className={`${!isEnabled ? 'disabled' : ""}  grid grid-cols-1 items-center justify-center`}>
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
                <div className='font-[300] space-y-4'>
                    <h1 className='text-[8mm]'>Overview</h1>
                    <p className='text-[4.5mm] text-neutral-500'>
                        <span className='font-medium'>{clinicName}</span> is a successful clinic by some metrics. There are however, areas to improve. Our aim in this report is to break down each section that we rated and provide various recommendations on how you can improve your rating.
                    </p>
                </div>
                <div className='text-[4.5mm]'>
                    <h1 className='font-medium'>Key points include:</h1>
                    <ul className='font-[300] text-neutral-500 list-disc p-4'>
                        <li>Your client NPS of 85 is (low, fair, very good, excellent)</li>
                        <li>Your team satisfaction was 8.6 out of 10 which is good</li>
                        <li>Your passive net profit % is (lower, at par, higher) than the national average</li>
                    </ul>
                </div>

                {npsContentItems.map((item, index) =>
                    <div key={index} className='!mt-[20mm] [&_>_*_>_*:nth-child(1)]:flex-col [&_>_*_>_*:nth-child(1)]:items-start [&_>_*_>_*:nth-child(1)]:!gap-[15mm] [&_>_*_>_*:nth-child(1)_>_*:nth-child(1)]:!max-w-full [&_>_*_>_*:nth-child(1)_>_*:nth-child(2)]:!gap-6 [&_>_*_>_*:nth-child(2)_*]:!text-[4.5mm] [&_>_*_>_*:nth-child(2)_ul]:font-[300] [&_>_*_>_*:nth-child(2)_ul]:text-neutral-500'>
                        <NpsContent surveyData={surveyData} item={item} />
                    </div>

                )}





            </div>


            
        </div>
    );
};

export default GenerateReport;
