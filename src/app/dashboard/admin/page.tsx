"use client";
import { useSessionContext } from "@/context/sessionContext";
import { useSurveyDataContext } from "@/context/surveyDataContext";
import { Column } from "primereact/column";
import {
  formatDateTime,
  getClientNps,
  getTeamNps,
  saveAsExcelFile,
} from "lib/helperFunctions";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Tooltip } from "primereact/tooltip";
import "jspdf-autotable";
import ExcelJS from "exceljs";
import { subscriptionLevels } from "lib/Const";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown } from "primereact/dropdown";
import { SurveyData } from "../../../../types/types";
export default function Page({ searchParams }: { searchParams: any }) {
  const { currentUser, users } = useSessionContext();
  const [globalFilter, setGlobalFilter] = useState("");

  let isAdmin = false;
  if (currentUser.role == "admin") {
    isAdmin = true;
  }

  const router = useRouter();
  if (!isAdmin) {
    redirect("/dashboard"); // Redirect to /dashboard
  }

  console.log(users, "users");

  let users_datatable_all: any[] = [];
  if (users.length) {
    users_datatable_all = users.map((i) => {
      const report = i.reports.at(-1);
      const surveyData: SurveyData = report
        ? JSON.parse(report.data)?.surveyData
        : report;
      const ownerSurvey = surveyData?.ownerSurveyData;
      const KPI = {
        Overall: surveyData && surveyData.overalls.mine?.toFixed(1),
        Clients: surveyData?.summary.clients.score,
        Team: surveyData?.summary.team.score,
        Finance: surveyData?.summary.finance.score,
        Strategy: surveyData?.summary.strategy.score,
        "Client NPS": surveyData && getClientNps(surveyData.clientSurveyData)?.score,
        "Team NPS": surveyData && getTeamNps(surveyData.teamSurveyData)?.score,
      };

      return {
        // 'Profile Picture': i.profile_pic,
        "Clinic Name": i.clinic_name,
        Email: i.useremail,
        ...KPI,
        "First Name": i.fname,
        "Last Name": i.lname,
        Mobile: i.usermobile,
        "Subscription Level": subscriptionLevels.find(
          (s) => String(s.level) == i.subscription_level
        )?.name,
        "Clinic Location State": i.clinic_location_state,
        "Clinic Location Country": i.clinic_location_country,
        "Clinic Postcode": i.clinic_location_postcode,
        "Clinic Established": i.clinic_established,
        "Services Provided": ownerSurvey?.services_provided,
        "Group Classes": ownerSurvey?.group_classes,
        "Practice Management Software":
          ownerSurvey?.practice_management_software,
        "Initial Consult Charge": ownerSurvey?.initial_consult_charge,
        "Followup Consult Charge": ownerSurvey?.followup_consult_charge,
        "Treating Hours": ownerSurvey?.treating_hours,
        "Managing Hours": ownerSurvey?.managing_hours,
        Turnover: ownerSurvey?.turnover,
        Profit: ownerSurvey?.profit,
        "Total Wages": ownerSurvey?.total_wages,
        "Non-clinician Wages": ownerSurvey?.non_clinician_wages,
        Rent: ownerSurvey?.rent,
        "Email Software": ownerSurvey?.email_software,
        "Employee Satisfaction Survey":
          ownerSurvey?.employee_satisfaction_survey,
        "Work Life Balance": ownerSurvey?.work_life_balance,
        "Created At": formatDateTime(i.createdAt),
      };
    });
  }

  const exportExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("data");

    // Assuming tableData is an array of objects
    worksheet.columns = Object.keys(users_datatable_all[0]).map((key) => ({
      header: key,
      key,
    }));

    users_datatable_all.forEach((data) => {
      worksheet.addRow(data);
    });

    const buffer = await workbook.xlsx.writeBuffer();

    const fileName = "RMC_USERS_REPORTS_SUMMARY.xlsx";

    saveAsExcelFile(buffer, fileName);
  };

  function tableRowOnClick(e: any) {
    let value = e.value;
    let user_id = users.find(
      (i: { useremail: any }) => i.useremail == value.Email
    )?._id;

    if (user_id) {
      // Navigate to the user page
      router.push(`/dashboard/admin/user/${user_id}`);
    }
  }

  return (
    <>
      <div className="card m-5">
        <Tooltip target=".export-buttons>button" position="bottom" />

        <div className="flex flex-row items-center">
          <div>
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText
                className="!shadow-none !py-2"
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                placeholder="Search..."
              />
            </IconField>
          </div>

          <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
            <Button
              type="button"
              icon="pi pi-file-excel"
              className="!bg-green-600 text-white !w-8 aspect-square"
              onClick={exportExcel}
              data-pr-tooltip="XLS"
            />
          </div>
        </div>
        <DataTable
          className="user_datatable"
          value={users_datatable_all}
          selectionMode="single"
          onSelectionChange={(e) => tableRowOnClick(e)}
          globalFilter={globalFilter}
          removableSort
          stripedRows
        >
          {Object.keys(users_datatable_all[0]).map((key, indx) => {
            if (key == "Profile Picture") {
              return <Column key={`${key}_${indx}`} field={key} header={key} />;
            } else if (key.toLowerCase() == "mobile") {
              return (
                <Column
                  className="text-nowrap"
                  key={`${key}_${indx}`}
                  body={""}
                  field={key}
                  header={key}
                />
              );
            } else {
              return (
                <Column
                  key={`${key}_${indx}`}
                  body={""}
                  field={key}
                  header={key}
                />
              );
            }
          })}
        </DataTable>
      </div>
    </>
  );
}
