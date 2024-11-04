export const appReportAsSurveyData = (currentUser:any,startDate:Date) =>{

    if(!currentUser) return false
    let surveyData
    let reportUse:boolean | number = false
    const reports = currentUser.reports
    const hasReports = reports.length
    
    if(!hasReports) return false
    // check if user is from free
    // let firstReportDate = new Date(currentUser.reports[0].date)
    // if(currentUser.subscription_level == 0){
    //     surveyData = JSON.parse(currentUser.reports[0].data).surveyData
    //     reportUse = 0
    // } else if(startDate.toLocaleDateString() == firstReportDate.toLocaleDateString()){
    //     if(currentUser.reports.length > 1){
    //         surveyData = JSON.parse(currentUser.reports[1].data).surveyData
    //         reportUse = 1
    //     }
    // } 
    
    surveyData = JSON.parse(reports[reports.length - 1].data).surveyData
    return {surveyData,reportUse}

}