"use client";

import { useState } from "react";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";

import { useSessionContext } from "@/context/sessionContext";
import ReportsSection, { ReportData } from "components/ReportsSections";
import { SaveReport } from "lib/generateReportData";
import { getClientNps, getTeamNps } from "lib/helperFunctions";

import {
  DropDownOption,
  SurveyReport,
  SurveyReportData,
} from "../../../../types/types";

const Page = () => {
  const { currentUser, setCurrentUser } = useSessionContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [newReport, setNewReport] = useState<ReportData>();
  const [isReportView, setIsReportView] = useState(true);

  const generateReport = async () => {
    setIsGenerating(true);

    const params = {
      currentUserId: currentUser._id,
      currentUserEmail: currentUser.useremail,
    };

    const newReport = await SaveReport(params);

    if (newReport?.data?.user) {
      const userData = newReport.data.user as { reports: [] };
      setCurrentUser({ ...currentUser, ...userData });
      setNewReport(userData.reports.at(-1));
    }

    setIsGenerating(false);
  };

  return (
    <div className="max-md:!max-w-[100vw] bg-transparent flex-1 p-6 gap-x-6 gap-y-10 flex flex-col">
      <div className="card flex flex-row items-center justify-between gap-10">
        <ul className="flex-1 max-w-lg grid gap-[1px] grid-cols-2 divide-x *:cursor-pointer *:border-none rounded-xl overflow-hidden ring-1 ring-gray-300 *:py-2 *:px-1 *:block text-sm text-neutral-500 *:text-center *:bg-white bg-gray-300">
          <li
            onClick={() => setIsReportView(true)}
            className={isReportView ? "!bg-orange-400 text-white" : ""}
          >
            <h1 className="md:text-xl font-medium">Reports</h1>
          </li>
          <li
            onClick={() => setIsReportView(false)}
            className={!isReportView ? "!bg-orange-400 text-white" : ""}
          >
            <h1 className="md:text-xl font-medium">Compare</h1>
          </li>
        </ul>

        {isReportView && (
          <Button
            disabled={isGenerating}
            onClick={generateReport}
            loading={isGenerating}
          >
            <span>Generate</span><span className="hidden sm:inline-flex ml-[1ch]">New Report</span>
          </Button>
        )}
      </div>

      <div className="card">
        {isReportView ? (
          <ReportsSection defaultReportData={newReport} />
        ) : (
          <ReportComparisonTable />
        )}
      </div>
    </div>
  );
};

export default Page;

// Report Comparison Table Component
function ReportComparisonTable() {
  const { currentUser } = useSessionContext();
  const [report1, setReport1] = useState("");
  const [report2, setReport2] = useState("");

  const reports: SurveyReport[] = currentUser.reports ?? [];

  const reportOptions: DropDownOption[] = reports.map((r) => ({
    name: r?.pdf_link?.split("/").at(-1) ?? "",
    code: r?._id ?? "",
  }));

  const getReportData = (id: string): SurveyReportData | null => {
    const report = reports.find((r) => r._id === id);
    try {
      return report?.data ? JSON.parse(report.data) : null;
    } catch {
      return null;
    }
  };

  const report1Data = getReportData(report1);
  const report2Data = getReportData(report2);

  const clientNPS1 = report1Data ? getClientNps(report1Data.surveyData.clientSurveyData) : { score: "" };
  const clientNPS2 = report2Data ? getClientNps(report2Data.surveyData.clientSurveyData) : { score: "" };
  const teamNPS1 = report1Data ? getTeamNps(report1Data.surveyData.teamSurveyData) : { score: "" };
  const teamNPS2 = report2Data ? getTeamNps(report2Data.surveyData.teamSurveyData) : { score: "" };

  const summaryKeys = Array.from(
    new Set([
      ...Object.keys(report1Data?.surveyData?.summary ?? {}),
      ...Object.keys(report2Data?.surveyData?.summary ?? {}),
    ])
  );

  return (
    <table className="text-sm comparison-report-table w-full border-collapse">
      <thead>
        <tr>
          <th></th>
          <th>
            <Dropdown
              value={report1}
              onChange={(e) => setReport1(e.value)}
              options={reportOptions.filter((o) => o.code !== report2)}
              optionLabel="name"
              optionValue="code"
              placeholder="Select a report"
              className="w-[25vw] md:w-[300px]"
              pt={{
                itemLabel: {
                  className:
                    "truncate w-full sm:text-xs block overflow-hidden text-ellipsis whitespace-nowrap",
                },
              }}
            />
          </th>
          <th>
            <Dropdown
              value={report2}
              onChange={(e) => setReport2(e.value)}
              options={reportOptions.filter((o) => o.code !== report1)}
              optionLabel="name"
              optionValue="code"
              placeholder="Select a report"
              className="w-[25vw] md:w-[300px]"
              pt={{
                itemLabel: {
                  className:
                    "truncate w-full max-sm:text-xs block overflow-hidden text-ellipsis whitespace-nowrap",
                },
              }}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="font-medium">Overalls</td>
          <td className="text-center">
            {report1Data?.surveyData?.overalls?.mine ?? ""}
          </td>
          <td className="text-center">
            {report2Data?.surveyData?.overalls?.mine ?? ""}
          </td>
        </tr>
        <tr>
          <td className="font-medium">Client NPS</td>
          <td className="text-center">{clientNPS1.score}</td>
          <td className="text-center">{clientNPS2.score}</td>
        </tr>
        <tr>
          <td className="font-medium">Team NPS</td>
          <td className="text-center">{teamNPS1.score}</td>
          <td className="text-center">{teamNPS2.score}</td>
        </tr>
        <tr>
          <td className="font-medium">Client</td>
          <td className="text-center">{report1Data?.surveyData?.summary.clients.score ?? ""}</td>
          <td className="text-center">{report2Data?.surveyData?.summary.clients.score ?? ""}</td>
        </tr>
        <tr>
          <td className="font-medium">Team</td>
          <td className="text-center">{report1Data?.surveyData?.summary.team.score ?? ""}</td>
          <td className="text-center">{report2Data?.surveyData?.summary.team.score ?? ""}</td>
        </tr>
        <tr>
          <td className="font-medium">Finance</td>
          <td className="text-center">{report1Data?.surveyData?.summary.finance.score ?? ""}</td>
          <td className="text-center">{report2Data?.surveyData?.summary.finance.score ?? ""}</td>
        </tr>
        <tr>
          <td className="font-medium">Strategy</td>
          <td className="text-center">{report1Data?.surveyData?.summary.strategy.score ?? ""}</td>
          <td className="text-center">{report2Data?.surveyData?.summary.strategy.score ?? ""}</td>
        </tr>

    
      </tbody>
    </table>
  );
}

