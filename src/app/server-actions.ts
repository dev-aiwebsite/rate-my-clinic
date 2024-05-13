"use server"
import { revalidatePath } from "next/cache"
import { signIn } from "./auth"
import { Users } from "./lib/models"
import { connectToDb } from "./lib/utils"
import bcrypt from 'bcrypt'

export const RegisterUser = async (formData:FormData) =>{

    const {username,useremail,clinic_type} = Object.fromEntries(formData)
    let emailExists = await Users.findOne({useremail})

    if(emailExists){
       console.log("email exist")
       return false;
    }
    let salt = bcrypt.genSaltSync(10) 
    const userpass = formData.get('userpass') as string;
    let hashedPass = await bcrypt.hash(userpass,salt)

    try {
        connectToDb()
        const newUser = new Users({username,useremail,password:hashedPass,clinic_type})
        await newUser.save()
        
    } catch (error:any) {
        console.log(error)
        throw new Error(error.toString())
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
    
}

