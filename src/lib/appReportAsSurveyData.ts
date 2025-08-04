import { reportGenDays } from "./Const"
import { hasPassedMaxDays } from "./helperFunctions"

export const appReportAsSurveyData = (currentUser:any,startDate:Date) =>{
    const {hasPassed, remainingDays, maxEndDate} = hasPassedMaxDays(startDate.toISOString(),reportGenDays)
    if(!currentUser || !hasPassed) return false
    let surveyData
    let reportUse:boolean | number = false
    const reports = currentUser.reports
    const hasReports = reports.length
    
    // if(!hasReports) return false

    return false // returning false because of new logic update to show report realtime data

    // check if user is from free
    // let firstReportDate = new Date(currentUser.reports[0].date)
    let lastReportDate = new Date(reports[hasReports - 1].date)
    let lastReportDateString = lastReportDate.toLocaleDateString()
    let startDateString = startDate.toLocaleDateString()


    if(currentUser.subscription_level == 0 || startDateString == lastReportDateString){
        surveyData = JSON.parse(currentUser.reports[0].data).surveyData
        reportUse = 0

    } else if(lastReportDateString >= maxEndDate.toLocaleDateString()) {
        //check last report date is subscription date + maxGenDays
        surveyData = JSON.parse(currentUser.reports[hasReports - 1].data).surveyData
        reportUse = hasReports - 1
        
    } 

    if(!surveyData) return false
    return {surveyData,reportUse}

}