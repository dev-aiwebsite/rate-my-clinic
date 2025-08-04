"use client";
import { IoIosArrowRoundBack } from "react-icons/io";
import Link from "next/link";
import SingleUserPageTemplate from "components/singe-user-page-template";
import { useEffect, useState } from "react";
import { useSessionContext } from "@/context/sessionContext";
import { getSurveyData } from "lib/server-actions";
import { ProgressSpinner } from "primereact/progressspinner";
import { redirect, useRouter } from "next/navigation";
import SummaryOverview from "components/summary-overview";
import CircleChart from "components/circle-chart";
import { getClientNps, getTeamNps } from "lib/helperFunctions";
import ClinicWorth from "components/ClinicWorth";
import { SurveyData } from "../../../../../../types/types";

const defaultNps = [
  {
    name: "Group A",
    value: 0,
    color: "#94BDE5",
  },
];

const charts = ["clients", "strategy", "team", "finance"];
export default function Page({ params }: { params: any }) {
  const { currentUser, users } = useSessionContext();
  const [surveyData, setSurveyData] = useState<SurveyData | null>(null);
  const userId = params.user_id;
  let user = users.find((i) => i._id == userId);
  if (currentUser.role != "admin") {
    redirect("/dashboard"); // Redirect to /dashboard
  }

  useEffect(() => {
    if (surveyData) return;
    
    if (!user) return;
    const getSD = async () => {
      let SD = await getSurveyData(userId);
      if (SD) {
        setSurveyData(SD);
      }
    };
    getSD();
  }, [surveyData, user, userId]);

  let is_ownerSurveyData_complete = surveyData?.ownerSurveyData ? true : false;
  let clientNps = defaultNps,
    teamNps = defaultNps,
    clientNpsAvg = "0",
    teamNpsAvg = "0";
  let showReport = false;

  if (is_ownerSurveyData_complete) {
    if (charts.includes("team") && charts.includes("clients")) {
      if (surveyData) {
        let filteredData = surveyData.clientSurveyData.filter(
          (i: any) => i.clinicid == userId
        );
        let filteredData_team = surveyData.teamSurveyData.filter(
          (i: any) => i.clinicId == userId
        );

        const clientNpsInfo = getClientNps(filteredData);
        clientNpsAvg = clientNpsInfo.score;

        const teamNpsInfo = getTeamNps(filteredData_team)
        teamNpsAvg = teamNpsInfo.score;
      }
    }

    clientNps = [
      {
        name: "Group A",
        value: Number(clientNpsAvg),
        color: "#94BDE5",
      },
    ];

    teamNps = [
      {
        name: "Group A",
        value: Number(teamNpsAvg),
        color: "#94BDE5",
      },
    ];
  }

  console.log(user, "user")
  return (
    <>
    <div className="flex flex-row gap-5 items-center">
      <Link
        className="m-2 block w-fit rounded-lg bg-transparent hover:bg-gray-100 p-2"
        href={"/dashboard/admin"}
      >
        <IoIosArrowRoundBack size={32} />
      </Link>
        <h1 className="text-black/50 text-lg">{user?.clinic_name}</h1>
    </div>

      <SummaryOverview
        enabled={charts}
        showReport={showReport}
        surveyData={surveyData}
        additionalClass={`m-5 single-user-summary-overview-wrapper card max-md:basis-full !px-0 md:*:px-6 gap-6 ${
          is_ownerSurveyData_complete ? "" : "disabled"
        }`}
      />

      <div className="grid md:grid-cols-3 gap-5 mx-5">
        <div className="text-center card flex items-center justify-center bg-custom-gradient text-white tracking-wide">
          <ClinicWorth
            surveyData={surveyData ?? undefined}
          />
        </div>
        <div className="card">
          <Link
            className="h-full gap-5 flex flex-col items-center justify-around"
            href={`/dashboard/admin/user/${userId}/nps?nps=client`}
          >
            <div className="flex-1 min-w-24 grid items-center md:justify-around">
              <p>Client NPS</p>
              <p className="md:hidden font-medium underline text-orange-400 hover:text-orange-500">
                View Chart
              </p>
            </div>
            <CircleChart className="!max-w-36" data={clientNps} max={100} />
            <div className="max-sm:hidden flex-1 min-w-24 grid items-center md:justify-around">
              <p className="text-xs font-medium underline text-orange-400 hover:text-orange-500">
                View Chart
              </p>
            </div>
          </Link>
        </div>

        <div className="card">
          <Link
            className="h-full gap-5 flex flex-col items-center justify-around"
            href={`/dashboard/admin/user/${userId}/nps?nps=team`}
          >
            <div className="flex-1 min-w-24 grid items-center md:justify-around">
              <p>Team Satisfaction</p>
              <p className="md:hidden font-medium underline text-orange-400 hover:text-orange-500">
                View Chart
              </p>
            </div>
            <CircleChart className="!max-w-36" data={teamNps} max={10} />
            <div className="max-sm:hidden flex-1 min-w-24 grid items-center md:justify-around">
              <p className="text-xs font-medium underline text-orange-400 hover:text-orange-500">
                View Chart
              </p>
            </div>
          </Link>
        </div>
      </div>

      <div className="card m-5">
        {!surveyData ? (
          <>
            <div className="flex justify-content-center">
              <ProgressSpinner />
            </div>
          </>
        ) : (
          <SingleUserPageTemplate
            surveyData={surveyData}
          ></SingleUserPageTemplate>
        )}
      </div>
    </>
  );
}
