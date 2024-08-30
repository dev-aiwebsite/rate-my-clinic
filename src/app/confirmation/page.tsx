import { AppSendMail, RegisterUser, UpdateUser } from "lib/server-actions";
import { redirect } from "next/navigation";
import Stripe from "stripe";
import { defaultEmailOption } from "../../../config/nodemailer.config";
import bcrypt from 'bcrypt';
import Link from "next/link";
import Image from "next/image";

const stripe = new Stripe(process.env.STRIPE_SECRET!);
export default async function Page({searchParams}:any) {
    
    const session_id = searchParams.session_id as string;
    if(session_id){
        const sessionInfo = await stripe.checkout.sessions.retrieve(session_id);
        
        let content = <> <h1 className="text-3xl text-bold">Thank you for subscribing</h1>
        <p className="mt-10">{`Your subscription is now confirmed and active. We have sent you an email with more details. If you don't see it, please check your spam folder.`}</p></>

        if(sessionInfo.status == "complete"){
            let subscription_level,subscription_id,name,fname,lname,useremail,clinic_name,clinic_type,password = 'Welcome1!'
            let formData = new FormData()

            fname = sessionInfo?.metadata?.fname;
            lname = sessionInfo?.metadata?.lname;
            useremail = sessionInfo?.metadata?.useremail || ""
            clinic_name = sessionInfo?.metadata?.clinic_name || "";
            clinic_type = sessionInfo?.metadata?.clinic_type || "";
            subscription_level = sessionInfo?.metadata?.subscription_level || "0";
            
            formData.append('username', `${fname} ${lname}`)
            formData.append('fname', fname as string)
            formData.append('lname', lname as string)
            formData.append('useremail', useremail as string)
            formData.append('clinic_name', clinic_name as string)
            formData.append('clinic_type', clinic_type as string)
            formData.append('userpass', password as string)
            formData.append('subscription_level', subscription_level as string)
            formData.append('subscription_id', sessionInfo?.subscription as string)
            formData.append('subscription_product_id', sessionInfo?.metadata?.product_id || "" as string)
            formData.append('last_checkout_session_id', sessionInfo?.id as string)

            //todo handle upgrade plan

            const res = await RegisterUser(formData)
            if(res.success){
                const parsedData = JSON.parse(JSON.stringify(res.data))
                type UserInfo = {
                    username: any;
                    useremail: any;
                    password: string;
                    "clinic name": string;
                    "clinic type": string;

                    [key: string]: any; // Add this line to define an index signature
                };
    
                const userInfo:UserInfo = {
                    username: parsedData.fname,
                    useremail: parsedData.useremail,
                    password: res.orig_pass,
                    "clinic name": parsedData.clinic_name,
                    "clinic type": parsedData.clinic_type,
                    
                }

                const link = process.env.NEXTAUTH_URL
    
                const htmlBody = `
                <p>Thank you ${fname} for subscribing.</p>
                <p>here is your account details</p><div>
                ${Object.keys(userInfo).map(i => `<b>${i}</b>: ${userInfo[i]}`).join('<br/>')}
                </div><br>
                <p>Click here to login : <a href="${link}/login">Login</a></p>
                <p>Click here to reset your password: <a href=${link}/forgot-password">Reset Password</a></p>
    
                `
                const mailOptions = {
                    to: userInfo.useremail,
                    subject: "Thank you for subscribing",
                    templateName: 'Welcome email',
                    dynamicFields: {
                        firstname: `${fname}`,
                        loginlink: `${link}`,
                        userpassword: res.orig_pass,
                        useremail: parsedData.useremail
                    }

                    
                }

                const emailed = await AppSendMail(mailOptions)
    
            } else if(res.message == "User email already exists"){
                console.log('already exist if block')
                let updateFormData = {
                    "subscription_level": subscription_level,
                    "subscription_id": sessionInfo?.subscription ,
                    "subscription_product_id": sessionInfo?.metadata?.product_id,
                    "last_checkout_session_id": sessionInfo?.id
                }
                
                const updateUserResult = await UpdateUser({"useremail":useremail},updateFormData)
                console.log(updateFormData, 'updateFormData')
                console.log(updateUserResult, 'updateUserResult')

                content = <>
                <h1 className="text-3xl text-bold">Your plan has updated successfully.</h1>
                    <Link className="block btn-primary uppercase w-fit mx-auto mt-10" href="/dashboard">Go to dashboard</Link>
                </>
    
            } else {
                content = <>
                <Image
                            className="w-16 mx-auto"
                            width={60}
                            height={60}
                            src="/icons/emailDelivery.svg"
                            alt="email delivery icon"
                        />
                        <h1 className="text-3xl text-bold">Thank you for subscribing</h1>
                    
                    <p className="mt-10">{`Your subscription is now confirmed and active. We have sent you an email with more details. If you don't see it, please check your spam folder.`}</p>
            </>
            }
        }


        return (<div className="w-screen h-screen flex items-center justify-center">
            <div className="max-w-[600px] mx-auto rounded-xl shadow-xl bg-white ring-1 ring-gray-100 overflow-hidden">
                 <div className="h-16 bg-[#004261] w-full flex flex-row items-center py-6 *:px-6">
                    <div className="">
                        <Image
                        className="h-auto w-24 m-auto"
                            src="/images/logos/RMC_Logo-MASTER.png"
                            width={60}
                            height={60}
                            alt="Picture of the author"
                        />
                    </div>
                    <div className="ml-auto text-sm text-white">
                        <Link className="hover:bg-white/20 rounded px-1.5 py-1" href='/login'>Login</Link>
                    </div>
                </div>
                <div className="py-10 px-20 text-center">
                    
                <Image
                            className="w-16 mx-auto"
                            width={60}
                            height={60}
                            src="/icons/emailDelivery.svg"
                            alt="email delivery icon"
                        />
                       {content}
                </div>

            </div>
            </div>
    
        )


    } else {
        redirect('/pricing')
    }


   
}