import { Recommendations } from "./recommendations"
import { getSurveyData, UpdateUser } from "./server-actions"
import { Tcategory } from "./recommendations"
import { createReportHtml } from "./createReportHtml"
import { savePdf } from "utils/savePdf"
export async function generateReportData({currentUserId,date}:{currentUserId?:string,date?:string}){
    let surveyData = await getSurveyData(currentUserId,date)
    let recommendations = {} as {[key:string]:any}

    let categories = ['clients','team','strategy', 'finance']

    categories.forEach(c => {
        let category = c as Tcategory
        recommendations[c] = Recommendations({surveyData,category})
    })

    let reportData = {
        surveyData: surveyData,
        recommendations
    }
    return reportData

}

export async function SaveReport({currentUserId,currentUserEmail,date}:{currentUserId?:string,currentUserEmail?:any,date?:string}) {
    try {
      const reportData = await generateReportData({currentUserId,date});
      let pdfUrl = "";
      if('surveyData' in reportData){
        const pdfHtml = await createReportHtml(reportData);
        if(pdfHtml){
          let pdfLink = await savePdf({htmlString:pdfHtml})
          if(pdfLink){
            pdfUrl = pdfLink
          }
        }
      }
      
      const cleanedFormData = {
        reports: {
          date: new Date(),  // Corrected key to match your schema
          pdf_link: pdfUrl,
          data: JSON.stringify(reportData),  // Store report data as a string
        },
      };
  
      // UpdateUser should be responsible for pushing the new report
      const res = await UpdateUser(
        { useremail: currentUserEmail },
        { $push: { reports: cleanedFormData.reports } }  // Use $push to add to the reports array
      );
  
      // Return success response
      if(res.success){
        return {
          success: true,
          message: "Report saved",
          data: res,
        };
        
      } else {

        return {
          success: false,
          message: res.message,
        };
      }
      
    } catch (err) {
      // Catch errors and return failure response
      return {
        success: false,
        message: 'An error occurred',
      };
    }
  }
  
  
