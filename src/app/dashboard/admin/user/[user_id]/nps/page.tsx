"use client";

import { useSessionContext } from "@/context/sessionContext";
import NpsChart from "components/nps-chart";
import { calculateNps } from "lib/helperFunctions";
import { getSurveyData } from "lib/server-actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";

type npsData =
  | {
      date: string;
      value: number;
      comment: string;
    }[]
  | null;

type npsItem = {
  date: string;
  value: number;
  comment: string;
  name?: string;
};

interface PageProps {
  params: {
    user_id: string;
  };
  searchParams: Record<string, string | string[] | undefined>;
}

type DataType = {
  other: {
    [key: string]: any;
  }[];
  other_summary: {};
  oldData: summary[];
  overalls: {
    [key: string]: any;
  };
  summary: {
    [key: string]: any;
  };
  ownerSurveyData?: any;
  clientSurveyData?: any;
  teamSurveyData?: any;
} | null;

export default function Page({ searchParams, params }: PageProps) {
  const [data, setData] = useState<DataType>(null);
  const { users } = useSessionContext();
  const userId = params.user_id;

  useEffect(() => {
    if (data) return;
    let user = users.find((i: { _id: string }) => i._id == userId);
    if (!user) return;
    const getSD = async () => {
      let SD = await getSurveyData(userId);
      if (SD) {
        setData(SD);
      }
    };
    getSD();
  }, [userId]);

  let filteredData;
  let npsCategory = searchParams.nps == "team" ? "team" : "client" as "team" | "client";
  let npsTextHeader = "Client NPS";

  if (npsCategory == "team") {
    npsTextHeader = "Team Satisfaction";
    filteredData =
      data?.teamSurveyData?.filter((i: any) => i.clinicId == userId) || null;
  } else {
    filteredData =
      data?.clientSurveyData?.filter((i: any) => i.clinicid == userId) || null;
  }

  console.log(data, "data");
  console.log(filteredData, "filteredData");
  let npsValues: number[] = [];
  let npsData: npsData = filteredData?.map((i) => {
    const date = new Date(i.createdAt);
    const formattedDate = date.toISOString().split("T")[0];

    let comment = i.strengths;
    let name = "";

    if (npsCategory != "team") {
      comment = `${i.recommendation_feedback}`;
      name = i.fname;
    }

    let nps: npsItem = {
      date: formattedDate,
      value: Number(i.recommendation),
      comment: comment,
      name: name,
    };
    npsValues.push(Number(i.recommendation));

    return nps;
  });


  const nps = calculateNps(npsValues, npsCategory)
  

  return (
    <>
      <Link
        className="m-2 block w-fit rounded-lg bg-transparent hover:bg-gray-100 p-2"
        href={`/dashboard/admin/user/${userId}`}
      >
        <IoIosArrowRoundBack size={32} />
      </Link>
      <div className="grid gap-5 m-5">
        <div className="col-span-3 row-span-1 flex flex-row items-center justify-between card">
          <h1 className="text-2xl capitalize">{`${npsTextHeader}: ${nps.score}`}</h1>
        </div>

        <div className="col-span-3 row-span-5 h-fit max-md:!pb-30 card">
          <NpsChart data={npsData} />
        </div>
      </div>
    </>
  );
}
