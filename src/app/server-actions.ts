"use server"
import { signIn, signOut, auth } from "./auth"
import { DB_TeamSurveyData, DB_ClientSurveyData, DB_OwnerSurveyData, Users } from "./lib/models"
import { connectToDb } from "./lib/utils"
import bcrypt from 'bcrypt'
import { MailOptions, transporter } from "../../config/nodemailer.config"
import { ExtendedSession } from '../../typings';
connectToDb()

export const RegisterUser = async (formData:FormData) =>{
    console.log(formData)
    let result = {
        success: false,
        data: null || "",
        orig_pass: "",
        message: null || ""
    }
    try {
        connectToDb()
    const {username,useremail,clinic_type,clinic_name} = Object.fromEntries(formData)
    let emailExists = await Users.findOne({useremail})
    let fd = Object.fromEntries(formData)

    if(emailExists){
       result.data = emailExists
       result.message = 'User email already exist'
       result.success = false
       return result;
    }
    let salt = bcrypt.genSaltSync(10) 
    const userpass = formData.get('userpass') as string;
    let hashedPass = await bcrypt.hash(userpass,salt)
        const newUser = new Users({...fd, password:hashedPass})
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
        console.log('update user')
        connectToDb()
        let user = await Users.findOneAndUpdate(query, data, {new:true})

        return JSON.parse(JSON.stringify(user))
        
    } catch (error:any) {
        console.log(error)
        throw new Error(error.toString())
    }
}

export const AuthenticateUser = async (formData: FormData) => {
    const { useremail, userpass } = Object.fromEntries(formData);    
    try {
        const redirectUrl = await signIn('credentials', { useremail, userpass, redirect: false });
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
        }
        
        return result

    } catch (error) {
        console.log(error)
        return {"success": false, 'message': error?.toString()}
        
    }
}


export const ClientSurveyAction = async (formData: FormData) => {
    console.log('Client survey form submitted')
    console.log(formData)
    
    try {
        connectToDb()
        const newClientSurvey = new DB_ClientSurveyData(Object.fromEntries(formData))
        await newClientSurvey.save()

        return {"success": true, 'message':'data save in database'}
    } catch (error) {
        console.log(error)
        return {"success": false, 'message': error?.toString()}
        
    }
}
export const TeamSurveyAction = async (formData: FormData) => {
    console.log('Team survey form submitted')
    console.log(formData)
    
    try {
        connectToDb()
        const newTeamSurvey = new DB_TeamSurveyData(Object.fromEntries(formData))
        await newTeamSurvey.save()

        return {"success": true, 'message':'data save in database'}
    } catch (error) {
        console.log(error)
        return {"success": false, 'message': error?.toString()}
        
    }
}

export const AppSendMail =  async(mailOptions:MailOptions) => {
    const {from,to,subject,htmlBody} = mailOptions
    try {
        await transporter.sendMail({
            from: 'RATE MY CLINIC <info@ratemyclinic@gmail.com>',
            to,
            subject,
            html: htmlBody
        })

        return {success: true, message: 'test'}

    } catch (error:any) {
        return {success: false , message: error}
    }

}

export const handleLogout = async () => {
    await signOut();
  };

export const resetPassword = async (formData: FormData) => {
console.log('owner survey form submitted')
console.log(formData)

try {
    connectToDb()
   

    return {"success": true, 'message':'data save in database'}
} catch (error) {
    console.log(error)
    return {"success": false, 'message': error?.toString()}
    
}
}



export const getSurveyData = async (currentUser_id?:string) => {
            
    if(!currentUser_id){
        const user = await auth() as ExtendedSession;
        currentUser_id = user?.user_id
    }

    
    if(!currentUser_id) return null
        
    try{
        
        let ownerSurveyData = await DB_OwnerSurveyData.findOne({clinic_id: currentUser_id })
        let clientSurveyData = await DB_ClientSurveyData.find()
        let teamSurveyData = await DB_TeamSurveyData.find()

        if(!ownerSurveyData){
            return null
        }

        let data = {
            ownerSurveyData: JSON.parse(JSON.stringify(ownerSurveyData)),
            clientSurveyData: JSON.parse(JSON.stringify(clientSurveyData)).filter((i:{clinicid: any;i:any}) => i.clinicid == currentUser_id),
            teamSurveyData: JSON.parse(JSON.stringify(teamSurveyData)).filter((i:{clinicId: any;i:any}) => i.clinicId == currentUser_id),
        }

        let summary = surveyCalculation(data)

        return {
            ...data,
            summary
        }

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
                weight: 10,
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
                weight: 10,
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
                weight: 10,
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
                weight: 10,
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
                    // Calculate the average
                    const total = value.reduce((sum: any, value: any) => sum + value, 0);
                    // const average = value.length > 0 ? total / value.length : 0;

                    let score = 0
                    if(total <= 20){
                        score = 0
                    } else if(total >= 95){
                        score = 100
                    } else {
                        score = 100 - ((total - 20) / (95 - 20) * 100)
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
                            score = 100 - ((value - 1) * (100 - 20) / (4 - 1));
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
                        score = 100 - ((average - 8) / (9.5 - 8) * 100)
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
                        score = 100 - ((average - 8) / (9.5 - 8) * 100)
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
                        score = 100 - ((average - 8) / (9.5 - 8) * 100)
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

                    if (average < 8) {
                        return 0
                    } else if (average > 9.5) {
                        return 100
                    } else {
                        return 100 - ((average - 8) / (9.5 - 8) * 100)
                    }

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
                        score = 100 - ((average - 8) / (9.5 - 8) * 100)
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
                        score = 100 - ((average - 50) / (80 - 50) * 100)
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
                        score = 100 - ((average - 8) / (9.5 - 8) * 100)
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
                score: function () {return (this.value == "yes" ? 100 : 50) * this.weight }
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
