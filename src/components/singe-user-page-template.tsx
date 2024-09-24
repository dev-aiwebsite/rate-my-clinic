"use client"

import { formatDateTime, saveAsExcelFile } from "lib/helperFunctions"
import 'jspdf-autotable'
import ExcelJS from 'exceljs';
import { Tooltip } from "primereact/tooltip"
import { Button } from "primereact/button"
import { DataTable } from "primereact/datatable"
import { Column } from "primereact/column"
import { TabView, TabPanel } from 'primereact/tabview';
import TableData from "components/table-data"
export default function SingleUserPageTemplate({surveyData}:{surveyData:any}) {

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


    let clientSurvey = surveyData?.clientSurveyData
    let client_datatable_all: any[] | undefined = []
    if(clientSurvey){
        client_datatable_all =  clientSurvey.map((i: { fname: any; lname: any; email: any; recommendation: any; recommendation_feedback: any; recommendedPreviously: any; servicesUsed: any; practitioner: any; receptionTeam: any; lookAndFeel: any; communication: any; bookingProcess: any; valueForMoney: any; website: any; improvementSuggestion: any; socialMediaUsed: any; followUpBookingConfirmation: any; group_age: any; comments_questions: any; createdAt: Date; },indx: any) => {
            return {
                'First Name': i.fname,
                'Last Name': i.lname,
                'Email': i.email,
                'Recommendation': i.recommendation,
                'Recommendation Feedback': i.recommendation_feedback,
                'Recommended Previously': i.recommendedPreviously,
                'Service Used': i.servicesUsed,
                'Satisfaction With Your practioner': i.practitioner,
                'Satisfaction With Our Admin Team': i.receptionTeam,
                'Look And Feel Of Our Practice': i.lookAndFeel,
                'Satisfaction With Our Communication': i.communication,
                'Satisfaction With Our Booking Process': i.bookingProcess,
                'Value For Money Of Your Treatment': i.valueForMoney,
                'Satisfaction With Our website': i.website,
                'Improvement Suggestion': i.improvementSuggestion,
                'Social Media used': i.socialMediaUsed,
                'Follow-up Appointment Booking Timeline': i.followUpBookingConfirmation,
                'Group Age': i.group_age,
                'Comments or Question':i.comments_questions,
                'Date': formatDateTime(i.createdAt)
            }
        })
    }


    
    let teamSurvey = surveyData?.teamSurveyData
    let team_datatable_all: any[] | undefined = []
    if(teamSurvey){
        team_datatable_all = teamSurvey.map((i: { fname: any; lname: any; email: any; recommendation: any; socialActivities: any; communication: any; professionalDevelopment: any; mentoring: any; teamWork: any; improvements: any; strengths: any; communicationRating: any; needsImprovement: any; rewardComparison: any; serviceKnowledge: any; additionalComments: any; createdAt: Date; },indx: any) => {
            return {
                'First Name': i.fname,
                'Last Name': i.lname,
                'Email': i.email,
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
    
    function tableRowOnClick(e:any){

    }

    const exportExcel = async (tabledata?: any[],filename = 'RMC_REPORT_DATA') => {
        if(!tabledata) return false
        
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('data');
      
        // Assuming tableData is an array of objects
        worksheet.columns = Object.keys(tabledata[0]).map(key => ({ header: key, key }));
      
        tabledata.forEach((data: any) => {
          worksheet.addRow(data);
        });
      
        const buffer = await workbook.xlsx.writeBuffer();
      
        saveAsExcelFile(buffer, `${filename}.xlsx`);
    };

        return <>
                <TabView>
                    <TabPanel header="Owner">
                        <TableData data={owner_datatable[0]}/>
                    </TabPanel>
                    <TabPanel header="Team">
                        <div>
                            <Tooltip target=".export-buttons>button" position="bottom" />
                            <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
                                <Button type="button" icon="pi pi-file-excel" className='bg-green-600 text-white p-2 w-fit aspect-square' onClick={() => exportExcel(team_datatable_all, 'RMC_TEAM_REPORT_DATA')} data-pr-tooltip="XLS" />
                            </div>

                            <DataTable value={team_datatable_all} selectionMode="single" onSelectionChange={(e) => tableRowOnClick(e)} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort>
                                {team_datatable_all?.length && Object.keys(team_datatable_all[0]).map((key,indx) => (
                                    <Column sortable key={`${key}_${indx}`} body={""} field={key} header={key} />
                                ))}
                            </DataTable>
                        </div>
                    </TabPanel>
                     <TabPanel header="Clients">
                        <div>
                            <Tooltip target=".export-buttons>button" position="bottom" />
                            <div className="flex align-items-center justify-end gap-2 w-full sticky top-0 z-10 bg-white p-2">
                                <Button type="button" icon="pi pi-file-excel" className='bg-green-600 text-white p-2 w-fit aspect-square' onClick={() => exportExcel(client_datatable_all,'RMC_CLIENTS_REPORT_DATA')} data-pr-tooltip="XLS" />
                            </div>

                            <DataTable value={client_datatable_all} selectionMode="single" onSelectionChange={(e) => tableRowOnClick(e)} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} removableSort>
                                {client_datatable_all?.length && Object.keys(client_datatable_all[0]).map((key,indx) => (
                                    <Column sortable key={`${key}_${indx}`} body={""} field={key} header={key} />
                                ))}
                            </DataTable>
                        </div>
                    </TabPanel>
                  

            </TabView>
        </>
}