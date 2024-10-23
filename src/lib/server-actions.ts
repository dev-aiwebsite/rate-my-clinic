"use server"
import { oldData } from './old-survey-data';
import { signIn, signOut, auth } from "../app/auth"
import { DB_TeamSurveyData, DB_ClientSurveyData, DB_OwnerSurveyData, Users } from "./models"
import { connectToDb } from "./utils"
import bcrypt from 'bcrypt'
import { MailOptions, elasticTransporter, transporter } from "../../config/nodemailer.config"
import { ExtendedSession } from '../../typings';
import ElasticEmail, { ApiClient, EmailsApi, EmailMessageData, EmailRecipient, BodyPart } from "@elasticemail/elasticemail-client"
import Stripe from "stripe"
connectToDb()

export const RegisterUser = async (formData:FormData) =>{
    let result = {
        success: false,
        data: "",
        orig_pass: "",
        message: ""
    }
    try {
        connectToDb()


        const fd = Object.fromEntries(formData)
        const {useremail} = fd
        let emailExists = await Users.findOne({useremail})
      

    if(emailExists){
       result.data = emailExists
       result.message = 'User email already exists'
       result.success = false
       return result;
    }
    const checkout_sessions = [{
        date: new Date(),
        checkout_id: fd['last_checkout_session_id'],
        subscription_level: fd['subscription_level']
    }]
    



    let salt = bcrypt.genSaltSync(10) 
    const userpass = formData.get('userpass') as string;
    let hashedPass = await bcrypt.hash(userpass,salt)
        const newUser = new Users({...fd, checkout_sessions, password:hashedPass})
        await newUser.save()
        result.data = newUser
        result.orig_pass = userpass,
        result.message = 'User created successfully'
        result.success = true
        return result
        
    } catch (error:any) {
        result.message = error.toString()
        result.success = false
        return result
    }
}

export const UpdateUser = async (query = {"useremail":"string"}, data = {}) =>{
    try {        
        let user = await Users.findOneAndUpdate(query, data, {new:true})

        let response = {
            user:JSON.parse(JSON.stringify(user)),
            success: true,
            message: 'User updated successfully'
        }
        return response
        
    } catch (error:any) {
        let response = {
            success: false,
            message:error.toString()
        }
        return response
    }
}

export const AuthenticateUser = async (formData: FormData) => {
    const { useremail, userpass, viaadmin } = Object.fromEntries(formData);    
    try {
        const redirectUrl = await signIn('credentials', { useremail, userpass, viaadmin, redirect: false });
        return true
    } catch (error) {
        return false
    }
};

export const OwnerSurveyAction = async (formData: FormData) => {
    type result = {
        [key:string]: any
    }

    let result:result = {
        success: false,
    }
    const formDataObj = Object.fromEntries(formData);
    const user = await auth() as ExtendedSession;
    let currentUser_id = user?.user_id
    const userEmail = user?.user_email
    const userFirstname = user?.user_name?.split(" ")[0]
    const link = `${process.env.NEXTAUTH_URL}/login?email=${userEmail}`
    const userData = await Users.findOne({useremail:userEmail})
    const ownerSurveyData = await DB_OwnerSurveyData.findOne({clinic_id: currentUser_id })

    
    
    try {

        if(ownerSurveyData){
            Object.assign(ownerSurveyData, formDataObj);
            await ownerSurveyData.save();
            result['message'] = "Data updated successfully"
            result['success'] = true
        } else {
            const newOwnerSurvey = new DB_OwnerSurveyData(formDataObj)
            await newOwnerSurvey.save()
            result['message'] = "Data saved successfully"
            result['success'] = true

            // set 14 days report email
            let sendTime:Date | undefined = new Date();
            sendTime.setDate(sendTime.getDate() + 14);
            sendTime.setHours(8, 0, 0, 0);
            
            // send instant when free user 
            if(Number(userData.subscription_level) < 1){
                sendTime = undefined
            }

            const  mailOptions = {
                to: userEmail,
                subject: "Your report is ready for download",
                templateName: 'Report ready',
                dynamicFields: {
                    firstname: `${userFirstname}`,
                    loginlink: `${link}`,
                    useremail: userEmail
                },
                sendTime: sendTime,
            }

           
            
            const emailed = await AppSendMail(mailOptions)
        }
        
        return result

    } catch (error) {
        return {"success": false, 'message': error?.toString()}
        
    }
}


export const ClientSurveyAction = async (formData: FormData) => {  
    try {
        connectToDb()
        const newClientSurvey = new DB_ClientSurveyData(Object.fromEntries(formData))
        await newClientSurvey.save()

        return {"success": true, 'message':'data save in database'}
    } catch (error) {
        return {"success": false, 'message': error?.toString()}
        
    }
}
export const TeamSurveyAction = async (formData: FormData) => {
    
    try {
        connectToDb()
        const newTeamSurvey = new DB_TeamSurveyData(Object.fromEntries(formData))
        await newTeamSurvey.save()

        return {"success": true, 'message':'data save in database'}
    } catch (error) {
        return {"success": false, 'message': error?.toString()}
        
    }
}

export const AppSendMail = async(mailOptions:MailOptions) => {
    try {
        const emailStatus = await SendMailViaElastic(mailOptions)
        return emailStatus

    } catch (error:any) {
        return {success: false , message: error}
    }

}



export const handleLogout = async () => {
    await signOut();
  };

export const resetPassword = async (formData: FormData) => {

try {
    connectToDb()
   

    return {"success": true, 'message':'data save in database'}
} catch (error) {
    return {"success": false, 'message': error?.toString()}
    
}
}



export const getSurveyData = async (currentUser_id?:string,date?:string) => {
            
    if(!currentUser_id){
        const user = await auth() as ExtendedSession;
        currentUser_id = user?.user_id
    }

    if(!currentUser_id) return null
        
    try{
        const dateFilter = date ? new Date(date) : null;

        let ownerSurveyData = await DB_OwnerSurveyData.find({
            // isDeleted: false,
            ...(dateFilter && { createdAt: { $lte: dateFilter } }),
        })
        let clientSurveyData = await DB_ClientSurveyData.find({
            isDeleted: false,
            ...(dateFilter && { createdAt: { $lte: dateFilter } }),
        })
        let teamSurveyData = await DB_TeamSurveyData.find({
            isDeleted: false,
            ...(dateFilter && { createdAt: { $lte: dateFilter } }),
        })

        if(!ownerSurveyData){
            return null
        }

        let convertedSurveys = {
            ownerSurveyData: JSON.parse(JSON.stringify(ownerSurveyData)),
            clientSurveyData: JSON.parse(JSON.stringify(clientSurveyData)),
            teamSurveyData: JSON.parse(JSON.stringify(teamSurveyData)),
        }

        let clinicIds = convertedSurveys.ownerSurveyData.map((i: { clinic_id: any }) => i.clinic_id)
        type mySurveys = {
            [key:string]:any,
            summary:{[key:string]:any},
            ownerSurveyData?:any,
            clientSurveyData?:any,
            teamSurveyData?:any
        }
        let mySurveys:mySurveys = {
            summary: {}
        }
        
        let otherSummary: { [key: string]: any; }[] = []

        clinicIds.forEach((clinicId: any) => {
            // owner survey must always be there
            // client and team survey cannot be there if owner survey is not present
            // if current user populate my surveys
            
            let clinicData = {
                ownerSurveyData: convertedSurveys.ownerSurveyData.filter((i:{clinic_id: any;i:any}) => i.clinic_id == clinicId)[0],
                clientSurveyData: convertedSurveys.clientSurveyData.filter((i:{clinicid: any;i:any}) => i.clinicid == clinicId),
                teamSurveyData: convertedSurveys.teamSurveyData.filter((i:{clinicId: any;i:any}) => i.clinicId == clinicId),
            }

            if(clinicId == currentUser_id){
                mySurveys = {
                    ...clinicData,
                    ...mySurveys
                }
                
            }

            if(!clinicData.ownerSurveyData) return

            if(clinicId == currentUser_id){
                let summary = surveyCalculation(clinicData)
                mySurveys.summary = summary
                return
            }

            if(!clinicData.clientSurveyData.length || !clinicData.teamSurveyData.length) return

            let summary = surveyCalculation(clinicData)
        
            // if(clinicId == currentUser_id){
            //     mySurveys.summary = summary
                
            // } else {
                otherSummary.push(summary)
            // }
            
    
        })


        let overalls:{[key:string]:any} = {}

        let other_summary = {}
        
        const oldDataTotal = oldData.reduce((a,b) => Number(a) + Number(b.overall), 0)
        overalls['other'] = oldDataTotal / oldData.length
        overalls['mine'] = Object.values(mySurveys.summary).reduce((a,b) => Number(a) + Number(b.score), 0) / 4

        if(otherSummary.length){
            let overall = otherSummary.map(summary => {
                return Object.values(summary).reduce((a,b) => Number(a) + Number(b.score), 0) / 4
            })
            
            let otherTotal = overall.reduce((a,b) => Number(a) + Number(b), 0)
            overalls['other'] = (oldDataTotal + otherTotal) / (oldData.length + overall.length)

            const otherTotalScore = {
                clients: otherSummary.reduce((a,b) => Number(a) + Number(b.clients.score), 0),
                team: otherSummary.reduce((a,b) => Number(a) + Number(b.team.score), 0),
                strategy: otherSummary.reduce((a,b) => Number(a) + Number(b.strategy.score), 0),
                finance: otherSummary.reduce((a,b) => Number(a) + Number(b.finance.score), 0),
            }
        
            let numbersOfSurveys = otherSummary.length + oldData.length
            
            other_summary = {
                clients: {score: (oldData.reduce((a,b) => Number(a) + Number(b.clients), 0) + otherTotalScore.clients) / numbersOfSurveys},
                team: {score: (oldData.reduce((a,b) => Number(a) + Number(b.team), 0) + otherTotalScore.team) / numbersOfSurveys},
                strategy: {score: (oldData.reduce((a,b) => Number(a) + Number(b.strategy), 0) + otherTotalScore.strategy) / numbersOfSurveys},
                finance: {score: (oldData.reduce((a,b) => Number(a) + Number(b.finance), 0) + otherTotalScore.finance) / numbersOfSurveys},
            }
            
        } else {
            other_summary = {
                clients: {score: oldData.reduce((a,b) => Number(a) + Number(b.clients), 0) / oldData.length},
                team: {score: oldData.reduce((a,b) => Number(a) + Number(b.team), 0) / oldData.length},
                strategy: {score: oldData.reduce((a,b) => Number(a) + Number(b.strategy), 0) / oldData.length},
                finance: {score: oldData.reduce((a,b) => Number(a) + Number(b.finance), 0) / oldData.length},
            }
        }

        let results = {
            ...mySurveys,
            other:otherSummary,
            other_summary,
            oldData,
            overalls
        }
        
        return results

    }
    catch (error:any){
        throw new Error(error.toString())
    }
}



function surveyCalculation(data:any) {
    // apoi = as percent of income
    interface SurveyData {
        _id: any;
        teamwork: number;
        communication:number;
        valueForMoney:number;
        receptionTeam:number;
        bookingProcess:number;
        website:number;
        lookAndFeel:number;
        referred_clients:number;
        socialActivities:number;
        professionalDevelopment:number;
        mentoring:number;
        recommendedPreviously:string;
        recommendation:number;
    }
    let summary:{[key: string]:any} = {
        strategy: {
            current_business_plan: {
                value: data.ownerSurveyData.current_business_plan,
                weight: 30,
                score: function () {return (this.value == "yes" ? 100 : 50) * this.weight }
            },
            plan_execution: {
                value: data.ownerSurveyData.plan_execution,
                weight: 20,
                score: function () { return (this.value <= 60 ? 0 : 70) * this.weight }
            },
            plan_review_timeline: {
                value: data.ownerSurveyData.plan_review_timeline,
                weight: 20,
                score: function () {
                    let val = this.value
                    if (this.value <= 6) {
                        val = 100;
                    } else if (this.value <= 12) {
                        val = 75;
                    } else if (this.value <= 24) {
                        val = 50;
                    } else {
                        val = 25;
                    }

                    return val * this.weight
                },
            },
            exit_plan: {
                value: data.ownerSurveyData.exit_plan,
                weight: 10,
                score: function () {return (this.value == "yes" ? 100 : 50) * this.weight }
            },
            leave_comfort_level:{
                value: data.ownerSurveyData.leave_comfort_level,
                weight: 20,
                score: function () {return this.value * this.weight}
            },

        },
        finance: {  
            owner_return_percent: {
                value: data.ownerSurveyData.treating_hours,
                weight: 50,
                score: function () {
                    // >25 = 100, <0 = 0. In between is pro-rated
                    let shouldBePayingThemselves = ((data.ownerSurveyData.treating_hours + data.ownerSurveyData.managing_hours) * 65) * 52
                    let actuallyPayingThemselves = (data.ownerSurveyData.pay_treating_clients + data.ownerSurveyData.pay_managing_business) * 52
                    let value = ((data.ownerSurveyData.profit - (shouldBePayingThemselves - actuallyPayingThemselves)) / data.ownerSurveyData.turnover) * 100
                    let score

                    if(value >= 25){
                        score = 100
                    }else if(value <= 0){
                        score = 0
                    }else{
                        score = (value / 25) * 100
                    }

                    return score * this.weight
                }
            },
            rent_apoi: {
                value: (data.ownerSurveyData.rent / data.ownerSurveyData.turnover) * 100,
                weight: 12.5,
                score: function () {
                    // <8 = 100. >16 = 0. In between is pro-rated
                    const value = this.value; 
                    const weight = this.weight; 
                    let score;
            
                    if (value < 8) {
                        score = 100;
                    } else if (value > 16) {
                        score = 0;
                    } else {
                        score = 100 - ((value - 8) / (16 - 8) * 100);
                    }
                    return score * weight; 
                }
            },
            total_salaries_apoi: {
                value: (data.ownerSurveyData.total_wages / data.ownerSurveyData.turnover) * 100,
                weight: 12.5,
                score: function () {
                    // <50 = 100. >70 = 0. In between is pro-rated
                    let value = this.value
                    let weight = this.weight
                    let score
                    if(value <= 50){
                        score = 100
                    } else if(value > 70){
                        score = 0
                    } else {
                        score = 100 - ((value - 50) / (70 - 50) * 100)
                    }

                    return score * weight; 
                }
            },
            non_clinicians_salary_apoi: {
                value: (data.ownerSurveyData.non_clinician_wages / data.ownerSurveyData.turnover) * 100,
                weight: 12.5,
                score: function () {
                    // <10 = 100. >20 = 0. In between is pro-rated
                      let value = this.value
                      let weight = this.weight
                      let score
                      if(value <= 10){
                          score = 100
                      } else if(value > 20){
                          score = 0
                      } else {
                          score = 100 - ((value - 10) / (20 - 10) * 100)
                      }
                      
                      return score * weight; 
                }
            },
            cash_monthly_multiple_expense: {
                value: data.ownerSurveyData.cash_reserves,
                weight: 12.5,
                score: function () {
                    // 4+ = 100, 3=75, 2=50, 1=25 
                    const value = this.value
                    let score = 0
                    
                    if(value == 1){
                        score = 25
                    } else if(value == 2){
                        score = 50
                    } else if(value == 3){
                        score = 75
                    } else if(value >= 4){
                        score = 100
                    }

                    return score * this.weight
                }
            },


           
        },
        clients:{
            nps: {
                // todo
                value: 0,
                weight: 30,
                score: function () {
                    // 95+ = 100, <20 = 0. In between is pro-rated

                    const value = data.clientSurveyData.map((i: SurveyData) => i.recommendation);
                    const detractors =  value.filter((i: number) => i <= 6).length
                    const promoters =  value.filter((i: number) => i >= 9).length

                    const nps = ((promoters - detractors) / value.length) * 100


                    let score = 0
                    if(nps <= 20){
                        score = 0
                    } else if(nps >= 95){
                        score = 100
                    } else {
                        score = ((nps - 20) / (95 - 20) * 100)
                    }

                    return score * this.weight
                }
            },
            client_survey: {
                value: data.ownerSurveyData.client_survey,
                weight: 10,
                score: function () {return (this.value == "yes" ? 100 : 50) * this.weight }
            },
            last_client_survey: {
                // Not done = 0.  4+ = 20. <1 = 100. Between those two is pro-rated 
                value: data.ownerSurveyData.last_client_survey,
                weight: 7.5,
                score: function () {
                    let value = this.value;
                    let weight = this.weight;
                    let score = 0;

                    if (data.ownerSurveyData.client_survey == 'yes') {
                        if (value <= 1) {
                            score = 100;
                        } else if (value >= 4) {
                            score = 20;
                        } else {
                            // Linear interpolation for values between 1 and 4
                            score = ((value - 1) * (100 - 20) / (4 - 1));
                        }
                    }

                    return score * weight; 
                }
            },
            valueForMoney: {
                value: 0,
                weight: 7.5,
                score: function () {
                    // Less than 8 = 0 and more than 9.5 =100. Between those two is pro-rated. 
                    const value = data.clientSurveyData.map((i: SurveyData) => i.valueForMoney);
                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;
                    let score
                    if (average < 8) {
                        score = 0
                    } else if (average > 9.5) {
                        score = 100
                    } else {
                        score = ((average - 8) / (9.5 - 8) * 100)
                    }

                    return score * this.weight

                }
            },
            receptionTeam: {
                value: 0,
                weight: 7.5,
                score: function () {
                    // Less than 8 = 0 and more than 9.5 =100. Between those two is pro-rated. 
                    const value = data.clientSurveyData.map((i: SurveyData) => i.receptionTeam);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;
                    let score
                    if (average < 8) {
                        score = 0
                    } else if (average > 9.5) {
                        score = 100
                    } else {
                        score = ((average - 8) / (9.5 - 8) * 100)
                    }

                    return score * this.weight
                }
            },
            communication: {
                value: 0,
                weight: 7.5,
                score: function () {
                    // Less than 8 = 0 and more than 9.5 =100. Between those two is pro-rated. 
                    const value = data.clientSurveyData.map((i: SurveyData) => i.communication);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;
                    let score
                    if (average < 8) {
                        score = 0
                    } else if (average > 9.5) {
                        score = 100
                    } else {
                        score = ((average - 8) / (9.5 - 8) * 100)
                    }
                    return score * this.weight
                }
            },
            bookingProcess: {
                value: 0,
                weight: 5,
                score: function () {
                    // Less than 8 = 0 and more than 9.5 =100. Between those two is pro-rated. 
                    const value = data.clientSurveyData.map((i: SurveyData) => i.bookingProcess);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;
                    let score
                    if (average < 8) {
                        score = 0
                    } else if (average > 9.5) {
                        score = 100
                    } else {
                        score = 100 - ((average - 8) / (9.5 - 8) * 100)
                    }
                    return score * this.weight
                }
            },
            website: {
                value: 0,
                weight: 10,
                score: function () {
                    // Less than 8 = 0 and more than 9.5 =100. Between those two is pro-rated. 
                    const value = data.clientSurveyData.map((i: SurveyData) => i.website);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;
                    let score
                    if (average < 8) {
                        score = 0
                    } else if (average > 9.5) {
                        score = 100
                    } else {
                        score = ((average - 8) / (9.5 - 8) * 100)
                    }
                    return score * this.weight
                }
            },
            recommendedPreviously: {
                value: 0,
                weight: 5,
                score: function () {
                    // Less than 50 = 0 and more than 80 =100. Between those two is pro-rated. 
                    const allData = data.clientSurveyData.map((i: SurveyData) => i.recommendedPreviously);
                    let allCount = allData.length
                    let count_yes = allData.filter((i: any) => i == "yes").length
                    let average = (count_yes / allCount) * 100
                    // Calculate the average
                    let score = 0
                    if (average < 50) {
                        score = 0
                    } else if (average > 80) {
                        score = 100
                    } else {
                        score = ((average - 50) / (80 - 50) * 100)
                    }
                    
                    return score * this.weight 

                }
            },
            lookAndFeel: {
                value: 0,
                weight: 5,
                score: function () {
                    // Less than 8 = 0 and more than 9.5 =100. Between those two is pro-rated. 
                    const value = data.clientSurveyData.map((i: SurveyData) => i.lookAndFeel);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;
                    let score
                    if (average < 8) {
                        score = 0
                    } else if (average > 9.5) {
                        score = 100
                    } else {
                        score = ((average - 8) / (9.5 - 8) * 100)
                    }

                    return score * this.weight

                }
            },
            client_source: {
                value: data.ownerSurveyData.client_source,
                weight: 5,
                score: function () {
                    return (this.value == "yes" ? 100 : 50) * this.weight 

                }
            }


        },
        team:{
            employee_satisfaction_survey: {
                value: data.ownerSurveyData.last_employee_survey,
                weight: 10,
                score: function () {
                    
                    return (this.value == "yes" ? 100 : 50) * this.weight 
                }
            },
            last_employee_survey: {
                // Not done = 0.  4+ = 20. <1 = 100. Between those two is pro-rated 
                value: data.ownerSurveyData.last_employee_survey,
                weight: 10,
                score: function () {
                    let value = this.value;
                    let weight = this.weight;
                    let score = 0;

                    if (data.ownerSurveyData.employee_satisfaction_survey == 'yes') {
                        if (value <= 1) {
                            score = 100;
                        } else if (value >= 4) {
                            score = 20;
                        } else {
                            // Linear interpolation for values between 1 and 4
                            score = 100 - ((value - 1) * (100 - 20) / (4 - 1));
                        }
                    }

                    return score * weight; 
                }
            },
            engagement: {
                //todo 
                value: 0,
                weight: 40,
                score: function () {
                    // 1-10 rating. >9.6 = 100, <7.5 = 0. In between is pro-rated
                    const value = data.teamSurveyData.map((i: SurveyData) => i.recommendation);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = total / value.length;

                    let proRatedScore = 0;
                    if (average > 9.6) {
                        proRatedScore = 100;
                    } else if (average < 7.5) {
                        proRatedScore = 0;
                    } else {
                        // Pro-rate calculation
                        proRatedScore = ((average - 7.5) / (9.6 - 7.5)) * 100;
                    }

                    return proRatedScore * this.weight

                }
            },
            socialActivities: {
                value: 0,
                weight: 10,
                score: function () {
                    // 1-10 rating. >9.6 = 100, <7.5 = 0. In between is pro-rated
                    const value = data.teamSurveyData.map((i: SurveyData) => i.socialActivities);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;

                    let proRatedScore = 0;
                    if (average > 9.6) {
                        proRatedScore = 100;
                    } else if (average < 7.5) {
                        proRatedScore = 0;
                    } else {
                        // Pro-rate calculation
                        proRatedScore = ((average - 7.5) / (9.6 - 7.5)) * 100;
                    }

                    return proRatedScore * this.weight

                }
            },
            communication: {
                value: 0,
                weight: 10,
                score: function () {
                    // 1-10 rating. >9.6 = 100, <7.5 = 0. In between is pro-rated
                    const value = data.teamSurveyData.map((i: SurveyData) => i.communication);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;

                    let proRatedScore = 0;
                    if (average > 9.6) {
                        proRatedScore = 100;
                    } else if (average < 7.5) {
                        proRatedScore = 0;
                    } else {
                        // Pro-rate calculation
                        proRatedScore = ((average - 7.5) / (9.6 - 7.5)) * 100;
                    }

                    return proRatedScore * this.weight

                }
            },
            professionalDevelopment: {
                value: 0,
                weight: 10,
                score: function () {
                    // 1-10 rating. >9.6 = 100, <7.5 = 0. In between is pro-rated
                    const value = data.teamSurveyData.map((i: SurveyData) => i.professionalDevelopment);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;

                    let proRatedScore = 0;
                    if (average > 9.6) {
                        proRatedScore = 100;
                    } else if (average < 7.5) {
                        proRatedScore = 0;
                    } else {
                        // Pro-rate calculation
                        proRatedScore = ((average - 7.5) / (9.6 - 7.5)) * 100;
                    }

                    return proRatedScore * this.weight

                }
            },
            mentoring: {
                value: 0,
                weight: 10,
                score: function () {
                    // 1-10 rating. >9.6 = 100, <7.5 = 0. In between is pro-rated
                    const value = data.teamSurveyData.map((i: SurveyData) => i.mentoring);

                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    const average = value.length > 0 ? total / value.length : 0;

                    let proRatedScore = 0;
                    if (average > 9.6) {
                        proRatedScore = 100;
                    } else if (average < 7.5) {
                        proRatedScore = 0;
                    } else {
                        // Pro-rate calculation
                        proRatedScore = ((average - 7.5) / (9.6 - 7.5)) * 100;
                    }

                    return proRatedScore * this.weight

                }
            },

        }
    }

    const scores: { [key: string]: any } = {};

    Object.keys(summary).forEach((key) => {
        scores[key] = {}
        Object.keys(summary[key]).forEach((key2, index) => {
            scores[key][key2] = summary[key][key2].score()

            if(index == Object.keys(summary[key]).length - 1){
                scores[key]['total'] = Object.values(scores[key]).reduce((a, b) => Number(a) + Number(b), 0);
                scores[key]['score'] = Math.round((scores[key]['total'] / 100) * 10) / 10;

            }
            
        })
    });
    return scores
}


export const SendMailViaElastic = async (mailOptions: MailOptions) => {
    let fromEmail = process.env.ELASTIC_EMAIL || "info.ratemyclinic@gmail.com";
    try {
        let defaultClient = ApiClient.instance;

        let apikey = defaultClient.authentications['apikey'];

        if (!process.env.EMAIL_API_KEY) {
            return { success: false, message: "ELASTIC_API_KEY is not defined" };
        }
        apikey.apiKey = process.env.EMAIL_API_KEY;

        let api = new EmailsApi();
        let timeOffset;
        if (mailOptions.sendTime) {
            const now = new Date();
            timeOffset = Math.round((mailOptions.sendTime.getTime() - now.getTime()) / 60000); // Convert milliseconds to minutes
        }

        let email = EmailMessageData.constructFromObject({
            Recipients: [
                new EmailRecipient(mailOptions.to, mailOptions?.name)
            ],
            Content: {
                Body: [
                    BodyPart.constructFromObject({
                        ContentType: "HTML",
                        Content: mailOptions?.htmlBody || ""
                    })
                ],
                Merge: mailOptions.dynamicFields,
                Subject: mailOptions?.subject || "",
                From: `Rate my clinic <${fromEmail}>`,
                TemplateName: mailOptions.templateName || "",
                Postback: mailOptions.sendTime ? mailOptions.sendTime.toISOString() : undefined,
            },
            Options: {
                TimeOffset: timeOffset || 0, // Use TimeOffset if provided
            }
        });

        // Wrap the emailsPost operation in a Promise
        const sendEmailPromise = new Promise<{ success: boolean; message?: string, data?: any, response?: any }>((resolve, reject) => {
            var callback = function (error: any, data: any, response: any) {
                if (error) {
                    console.error('Error sending email:', error);
                    reject({ success: false, message: error.message || "Failed to send email" });
                } else {
                    resolve({ success: true, message: "Email sent successfully", data:data, response:response });
                }
            };

            api.emailsPost(email, callback);
        });

        // Await the completion of the Promise and return the result
        return await sendEmailPromise;

    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error('Error sending email:', error);
            return { success: false, message: error.message || "Failed to send email" };
        } else {
            return { success: false, message: "Failed to send email" };
        }
    }
};


export const handleScheduleEmail = async () => {
    const sendTime = new Date(); // Set your desired send time
    sendTime.setHours(sendTime.getHours() + 6); // Example: 10 minutes from now

    const recipient = 'dev@aiwebsiteservices.com';
    const subject = 'Scheduled Email';
    const body = `Hello! This is a scheduled email 5 minutes from now. ${sendTime.toString()}`;
   
    const mailOptions = {
        to: recipient,
        subject: subject,
        htmlBody: body,
        sendTime: sendTime, // Include the send time here
    };

    // const result = await SendMailViaElastic(mailOptions);
    // return JSON.parse(JSON.stringify(result))
    return 
};





export const GetProducts = async() => {
    const stripe = new Stripe(process.env.STRIPE_SECRET!)
    const products = await stripe.products.search({
        query: 'active:\'true\' AND metadata[\'app_name\']:\'rmc\'',
      });

    return products.data
}
// Fetch prices for products
const fetchProductPrices = async (productId: string) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET!)
    const prices = await stripe.prices.list({
      product: productId,
    });
    return prices.data; // This will give you an array of price objects
  };

export const GetProductsWithPrices = async () => {
    try {
      // Search for active products
      const stripe = new Stripe(process.env.STRIPE_SECRET!)
      const productsResponse = await stripe.products.search({
        query: 'active:\'true\' AND metadata[\'app_name\']:\'rmc\'',
      });
  
      // Fetch prices for each product
      const productsWithPrices = await Promise.all(
        productsResponse.data.map(async (product) => {
          const prices = await fetchProductPrices(product.id);
          return {
            ...product,
            prices, // Attach the prices to the product
          };
        })
      );
  
      return productsWithPrices;
    } catch (error) {
      console.error('Error fetching products with prices:', error);
      return [];
    }
  };