"use client"

import { formatDateTime} from "lib/helperFunctions"
import CustomDataTable from "./datatable";

export default function TeamDataTable({teamSurveyData,options}:{teamSurveyData:any; options?:{[key:string]:any}}) {
    let team_datatable_all: any[] = []
    if(teamSurveyData){
        team_datatable_all = teamSurveyData.map((i: {_id:string; fname: any; lname: any; email: any; recommendation: any; socialActivities: any; communication: any; professionalDevelopment: any; mentoring: any; teamWork: any; improvements: any; strengths: any; communicationRating: any; needsImprovement: any; rewardComparison: any; serviceKnowledge: any; additionalComments: any; createdAt: Date; },indx: any) => {
            return {
                // 'First Name': i.fname,
                // 'Last Name': i.lname,
                // 'Email': i.email,
                "id":i._id,
                'Recommendation': i.recommendation,
                'Social Activities': i.socialActivities,
                'Communication': i.communication,
                'Professional Development': i.professionalDevelopment,
                'Mentoring': i.mentoring,
                'Team Work': i.teamWork,
                'Improvements': i.improvements,
                'Strengths': i.strengths,
                'Communication Rating': i.communicationRating,
                'Needs Improvement': i.needsImprovement,
                'Reward Comparison': i.rewardComparison,
                'Service Knowledge': i.serviceKnowledge,
                'Additional Comments': i.additionalComments,
                'Date': formatDateTime(i.createdAt)
            }
        })
    }

    return <>
            <CustomDataTable datatable={team_datatable_all} options={options}/>
        </>
}