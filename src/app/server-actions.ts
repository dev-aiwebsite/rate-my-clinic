"use server"
import { revalidatePath } from "next/cache"
import { signIn } from "./auth"
import { Users } from "./lib/models"
import { connectToDb } from "./lib/utils"
import bcrypt from 'bcrypt'
import { MailOptions, transporter } from "../../config/nodemailer.config"

export const RegisterUser = async (formData:FormData) =>{
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

    if(emailExists){
       result.data = emailExists
       result.message = 'User email already exist'
       result.success = false
       return result;
    }
    let salt = bcrypt.genSaltSync(10) 
    const userpass = formData.get('userpass') as string;
    let hashedPass = await bcrypt.hash(userpass,salt)
        const newUser = new Users({username,useremail,password:hashedPass,clinic_name,clinic_type})
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
    //    const query = { "useremail": 'test@gmail.com' }
    //    const data ={ "img": 'https://ucarecdn.com/30b83b52-ef0f-43f2-a363-98946f94e07a/' }
        let user = await Users.findOneAndUpdate(query, data, {new:true})
        revalidatePath('/dashboard')
        return user
        
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
    console.log('owner survey form submitted')
        console.log(formData)
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
