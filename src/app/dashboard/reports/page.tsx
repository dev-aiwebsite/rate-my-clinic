"use client";
import { useSessionContext } from "@/context/sessionContext";
import ReportsSection, { ReportData } from "components/ReportsSections";
import { SaveReport } from "lib/generateReportData";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useState } from "react";
import { DropDownOption, SurveyReport, SurveyReportData } from "../../../../types/types";
import { getClientNps, getTeamNps } from "lib/helperFunctions";

const Page = () => {
  const { currentUser, setCurrentUser } = useSessionContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReport, setNewReport] = useState<ReportData | undefined>();
  const [isReportView, setIsReportView] = useState(true);

  async function generateReport() {
    console.log("generating new report");
    setIsGenerating(true);
    let params = {
      currentUserId: currentUser._id,
      currentUserEmail: currentUser.useremail,
    };
    const newReport = await SaveReport(params);
    if (newReport?.data && "user" in newReport.data) {
      if (newReport.data.user) {
        const newUserData = newReport.data.user as { reports: [] };
        setCurrentUser({ ...currentUser, ...newUserData });
        setNewReport(newUserData.reports.at(-1));
        setIsGenerating(false);
      }
    }

    console.log(newReport, "new report");
  }

  return (
    <div className="max-md:!max-w-[100vw] bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col">
      <div className="card flex flex-row items-center justify-between">
        <ul className="flex-1 max-w-lg grid gap-[1px] grid-cols-2 divide-x *:cursor-pointer *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
          <li
            onClick={() => setIsReportView(true)}
            className={isReportView ? "!bg-orange-400 text-white" : ""}
          >
            <h1 className="text-xl font-medium">Reports</h1>
          </li>
          <li
            onClick={() => setIsReportView(false)}
            className={!isReportView ? "!bg-orange-400 text-white" : ""}
          >
            <h1 className="text-xl font-medium">Compare</h1>
          </li>
        </ul>

        {isReportView && (
          <Button
            disabled={isGenerating}
            onClick={generateReport}
            loading={isGenerating}
          >
            Generate New Report
          </Button>
        )}
      </div>

      <div className="card">
        {isReportView && <ReportsSection defaultReportData={newReport} />}
        {!isReportView && (
          <>
            <ReportComparisonTable />
          </>
        )}
      </div>
    </div>
  );
};

export default Page;



function ReportComparisonTable() {
  const { currentUser } = useSessionContext();
  const [report1, setReport1] = useState("");
  const [report2, setReport2] = useState("");
const reports:SurveyReport[] = currentUser.reports

  const reportOptions:DropDownOption[] = reports.map(i => {
    return { name: i?.pdf_link?.split("/").at(-1) ?? "", code: i?._id ?? ""};
  });

  const report1Data:SurveyReportData = report1 ? JSON.parse(reports.find(i => i._id == report1)?.data ?? "") : ""
  const report2Data:SurveyReportData = report2 ? JSON.parse(reports.find(i => i._id == report2)?.data ?? "") : ""

  const clientNPS1 = report1Data ? getClientNps(report1Data.surveyData.clientSurveyData) : ""
  const clientNPS2 = report2Data ? getClientNps(report2Data.surveyData.clientSurveyData) : ""
  const teamNPS1 = report1Data ? getTeamNps(report1Data.surveyData.teamSurveyData) : ""
  const teamNPS2 = report2Data ? getTeamNps(report2Data.surveyData.teamSurveyData) : ""


  return (
    <>
      <table className="text-sm comparison-report-table w-full border-collapse">
        <thead>
            <tr>
            <th>
            </th>
              <th>
                <div>
                  <Dropdown
                    value={report1}
                    onChange={(e) => setReport1(e.value)}
                    options={reportOptions.filter((i) => i.code != report2)}
                    optionLabel="name"
                    optionValue="code"
                    placeholder="Select a report"
                    className="w-[300px]"
                    pt={{
                        itemLabel:{
                            className: 'truncate w-full block overflow-hidden text-ellipsis whitespace-nowrap'
                          }
                      }}
                  />
                </div>
              </th>
              <th>
                <div>
                <Dropdown
      value={report2}
      onChange={(e) => setReport2(e.value)}
      options={reportOptions.filter((i) => i.code != report1)}
      optionLabel="name"
      optionValue="code"
      placeholder="Select a report"
      className="w-[300px]"
      pt={{
        itemLabel:{
            className: 'truncate w-full block overflow-hidden text-ellipsis whitespace-nowrap'
          }
      }}
    />
    
                </div>
              </th>
            
              </tr>
        </thead>
        <tbody>
            {(report1 || report2) && <>
            
                <tr>
                <td>
                    <span className="font-medium">Overalls</span>
                </td>
                <td className="text-center">
                    <span>{report1Data?.surveyData?.overalls?.mine ?? ""}</span>
                </td>
                <td className="text-center">
                    <span>{report2Data?.surveyData?.overalls?.mine ?? ""}</span>
                </td>
            </tr>
                <tr>
                <td>
                    <span className="font-medium">Client NPS</span>
                </td>
                <td className="text-center">
                    <span>{clientNPS1.score}</span>
                </td>
                <td className="text-center">
                    <span>{clientNPS2.score}</span>
                </td>
            </tr>
                <tr>
                <td>
                    <span className="font-medium">Team NPS</span>
                </td>
                <td className="text-center">
                    <span>{teamNPS1.score}</span>
                </td>
                <td className="text-center">
                    <span>{teamNPS2.score}</span>
                </td>
            </tr>
            {Object.keys(report1Data.surveyData.summary).map(i => {
                const item1 = report1Data?.surveyData?.summary[i]?.score ?? ""
                const item2 = report2Data?.surveyData?.summary[i]?.score ?? ""
                return  <tr key={i}>
                <td>
                    <span className="font-medium">{i}</span>
                </td>
                <td className="text-center">
                    <span>{item1}</span>
                </td>
                <td className="text-center">
                    <span>{item2}</span>
                </td>
            </tr>
            })}
            
            </>
            }

           
        </tbody>
      </table>
    </>
  );
}
