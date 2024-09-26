"use client"
import { formatDateTime} from "lib/helperFunctions"
import CustomDataTable from "./datatable";
export default function ClientsDataTable({clientSurveyData,options}:{clientSurveyData:any; options?:{[key:string]:any}}) {
    let client_datatable_all: any[] = []
    if(clientSurveyData){
        client_datatable_all =  clientSurveyData.map((i: {_id:string; fname: any; lname: any; email: any; recommendation: any; recommendation_feedback: any; recommendedPreviously: any; servicesUsed: any; practitioner: any; receptionTeam: any; lookAndFeel: any; communication: any; bookingProcess: any; valueForMoney: any; website: any; improvementSuggestion: any; socialMediaUsed: any; followUpBookingConfirmation: any; group_age: any; comments_questions: any; createdAt: Date; },indx: any) => {
            return {
                // 'First Name': i.fname,
                // 'Last Name': i.lname,
                // 'Email': i.email,
                'id':i._id,
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

        return <>
                 <CustomDataTable datatable={client_datatable_all} options={options}/>
        </>
}