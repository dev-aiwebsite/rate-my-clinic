import { AppSendMail, RegisterUser } from "@/server-actions";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { defaultEmailOption } from "../../../config/nodemailer.config";
import bcrypt from 'bcrypt';
import Link from "next/link";

const stripe = new Stripe(process.env.STRIPE_SECRET!);
export default async function Page({searchParams}:any) {
    const session_id = searchParams.session_id as string;
    if(session_id){
        const sessionInfo = await stripe.checkout.sessions.retrieve(session_id);
        console.log(sessionInfo.status);
    
       
        if(sessionInfo.status == "complete"){
            let name,email,clinic_name,clinic_type,password = 'Welcome1!'
            let formData = new FormData()


            name = sessionInfo.customer_details.name
            email = sessionInfo.customer_details.email
            clinic_name = sessionInfo.custom_fields.find(i => i.key == "clinic_name").text.value
            clinic_type = sessionInfo.custom_fields.find(i => i.key == "clinic_type").dropdown.value
            
            formData.append('username', name as string)
            formData.append('useremail', email as string)
            formData.append('clinic_name', clinic_name as string)
            formData.append('clinic_type', clinic_type as string)
            formData.append('userpass', password as string)

            const res = await RegisterUser(formData)
            console.log(res)
            if(res.success){
                const { from } = defaultEmailOption
                const parsedData = JSON.parse(JSON.stringify(res.data))
                type UserInfo = {
                    username: any;
                    useremail: any;
                    password: string;
                    "clinic name": any;
                    "clinic type": any;
                    [key: string]: any; // Add this line to define an index signature
                };
    
                const userInfo:UserInfo = {
                    username: parsedData.username,
                    useremail: parsedData.useremail,
                    password: res.orig_pass,
                    "clinic name": parsedData.clinic_name,
                    "clinic type": parsedData.clinic_type,
                    
                };
    
                console.log(res.orig_pass)
    
                const htmlBody = `
                <p>Thank you ${name} for subscribing.</p>
                <p>here is your account details</p><div>
                ${Object.keys(userInfo).map(i => `<b>${i}</b>: ${userInfo[i]}`).join('<br/>')}
                </div><br>
                <p>Click here to login : <a href="http://localhost:3000/login">Login</a></p>
                <p>Click here to reset your password: <a href="http://localhost:3000/forgetpassword">Reset Password</a></p>
    
                `
                const mailOptions = {
                    from,
                    to: userInfo.useremail || process.env.GMAIL_EMAIL || "",
                    subject: "Thank you for subscribing",
                    htmlBody
                }
                const emailed = await AppSendMail(mailOptions)
                console.log(emailed)
                return <>
                    <h1>{res.message}</h1>
                    <h1>{emailed.message}</h1>
                </>
    
            } else if(res.message == "User email already exist"){
                return <>
                    <h1>Thank you for subscribing</h1>
                    <Link href="/login">Login here</Link>
                </>
    
            } else {
                return <>
                <h1>Thank you for subscribing</h1>
                <p>You will be receiving an email shortly</p>
            </>
            }
        }
    
       


    } else {
        redirect('/pricing')
        
    }


   
}