"use client"
import GenerateReport from "components/generateReport";
import { createReportHtml } from "lib/createReportHtml";
import { useEffect, useState } from "react";
const Page = () => {
    const [reportHtml,setReportHtml] = useState<string | null>(null)
    useEffect(()=>{
        
        const renderReport = async () => {
            const reportHtml = await createReportHtml()
            if(reportHtml){
                setReportHtml(reportHtml)
            }
        }

        renderReport()
    },[])
    return (<>
    {reportHtml && <div dangerouslySetInnerHTML={{ __html: reportHtml }}>

    </div>}
    </>);
}

export default Page;