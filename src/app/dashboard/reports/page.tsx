"use client"
import { useSessionContext } from "@/context/sessionContext";
import ReportsSection, { ReportData } from "components/ReportsSections";
import { SaveReport } from "lib/generateReportData";
import { Button } from "primereact/button";
import { useState } from "react";

const Page = () => {
    const {currentUser, setCurrentUser} = useSessionContext()
    const [isGenerating, setIsGenerating] = useState(false)
    const [newReport,setNewReport] = useState<ReportData | undefined>()
    
    async function generateReport() {
        console.log('generating new report')
        setIsGenerating(true)
        let params = {
            currentUserId: currentUser._id,
            currentUserEmail: currentUser.useremail,
        };
        const newReport = await SaveReport(params);
        if (newReport?.data && 'user' in newReport.data) {
            if (newReport.data.user) {
                const newUserData = newReport.data.user as {reports:[]}
                setCurrentUser({ ...currentUser, ...newUserData });
                setNewReport(newUserData.reports.at(-1))
                setIsGenerating(false)
            }
        }

        console.log(newReport, 'new report')
    }

    return (
        <div className="max-md:!max-w-[100vw] bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col">
            <div className="card flex flex-row items-center justify-between">
                <h1 className="text-xl font-medium mr-4">Reports</h1>
                <Button disabled={isGenerating} onClick={generateReport} loading={isGenerating}>Generate New Report</Button>
            </div>

            <div className="card">
                <ReportsSection defaultReportData={newReport}/>

            </div>

        </div>



    );
}

export default Page;