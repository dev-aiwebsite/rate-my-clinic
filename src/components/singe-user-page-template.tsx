"use client"
import { TabView, TabPanel } from 'primereact/tabview';
import TableData from "components/table-data"
import ClientsDataTable from "./clients-datatable";
import TeamDataTable from "./team-datatable";
import { useState } from 'react';
export default function SingleUserPageTemplate({surveyData}:{surveyData:any}) {
    const [clientSurvey,setClientSurvey] = useState(surveyData?.clientSurveyData)
    const [teamSurvey,setTeamSurvey] = useState(surveyData?.teamSurveyData)
    if(!surveyData) return <><span>User not found.</span></>
    let ownerSurvey = surveyData?.ownerSurveyData
    let owner_datatable = []
    if(ownerSurvey){
        owner_datatable.push({
                'First Name': ownerSurvey.owner_fname,
                'Last Name': ownerSurvey.owner_lname,
                'Email': ownerSurvey.owner_email,
                'Mobile': ownerSurvey.owner_mobile,
                'Clinic Name': ownerSurvey.clinic_name,
                'Clinic Location State': ownerSurvey.clinic_location_state,
                'Clinic Location Country': ownerSurvey.clinic_location_country,
                'Clinic Postcode': ownerSurvey.clinic_location_postcode,
                'Clinic Established': ownerSurvey.clinic_established,
                'Services Provided': ownerSurvey.services_provided,
                'Group Classes': ownerSurvey.group_classes,
                'Practice Management Software': ownerSurvey.practice_management_software,
                'Initial Consult Charge': ownerSurvey.initial_consult_charge,
                'Followup Consult Charge': ownerSurvey.followup_consult_charge,
                'Treating Hours': ownerSurvey.treating_hours,
                'Managing Hours': ownerSurvey.managing_hours,
                'Turnover': ownerSurvey.turnover,
                'Profit': ownerSurvey.profit,
                'Total Wages': ownerSurvey.total_wages,
                'Non-clinician Wages': ownerSurvey.non_clinician_wages,
                'Rent': ownerSurvey.rent,
                'Email Software': ownerSurvey.email_software,
                'Employee Satisfaction Survey': ownerSurvey.employee_satisfaction_survey,
                'Work Life Balance': ownerSurvey.work_life_balance,
            })
    }

    const teamTableOptions = {
        'delete':{
            "enabled":true,
            "db_name":'team',
        },
        "updateData": (newData: any) => {setTeamSurvey(newData)},
        "data":teamSurvey
    }
    const clientTableOptions = {
        'delete':{
            "enabled":true,
            "db_name":'client',
        },
        "updateData": (newData: any) => {setClientSurvey(newData)},
        "data":clientSurvey
    }
    return <>
            <TabView>
                <TabPanel header="Owner">
                    <TableData data={owner_datatable[0]}/>
                </TabPanel>
                <TabPanel header="Team">
                    <TeamDataTable options={teamTableOptions} teamSurveyData={teamSurvey}/>
                </TabPanel>
                    <TabPanel header="Clients">
                    <ClientsDataTable options={clientTableOptions} clientSurveyData={clientSurvey}/>
                </TabPanel>
        </TabView>
    </>
}