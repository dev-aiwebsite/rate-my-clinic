import { NextRequest, NextResponse } from "next/server";
import { AppSendMail, UpdateUser } from "lib/server-actions";
import { Users } from "lib/models";
import { randomUUID } from 'crypto';
import { fetchData } from 'lib/data';
import { connectToDb } from 'lib/utils';
import bcrypt from 'bcrypt'

export async function POST(req:NextRequest, res: NextResponse){
    const payload = await req.text()
    const response =  JSON.parse(payload)

    console.log(req)
    const users = await fetchData()
    
    const reqAction = response.action
    
    let targetUser = users.find(i => i.useremail == response.useremail) || null

    
    if(!targetUser) return NextResponse.json({success: false, message: "No user found with that email"})


    
    try {
        let emailStatus
        if(reqAction == "reset_password"){
            emailStatus = await resetPassword(response.useremail,response.userpass)

        } else {
            
            emailStatus = await sendPasswordResetLink(response.useremail, targetUser.fname)
        }
        
        return NextResponse.json({success: emailStatus.success, message: emailStatus.message})

    } catch (error) {
        console.log(error)
        return NextResponse.json({success: false, message: error})
    }
}

async function sendPasswordResetLink(email:string,name:string) {
    const passwordResetToken = randomUUID();
    const domain = process.env.NEXTAUTH_URL
    const htmlBody = `
        <p>Dear User,</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${domain}/forgot-password?ue=${encodeURIComponent(email)}&t=${passwordResetToken}">Reset Password</a></p>
        <p>If you did not request a password reset, please ignore this email.</p>
    `;
    
    const mailOptions = {
        to: email,
        subject: ' Password Reset Request',
        // htmlBody, // Use 'html' instead of 'htmlBody',
        templateName: 'Password reset email',
        dynamicFields: {
            firstname: `${name}`,
            resetlink: `${domain}/forgot-password?ue=${encodeURIComponent(email)}&t=${passwordResetToken}`
        }
        
        
    };


    try {
        const res = await AppSendMail(mailOptions);
        
        if(res.success){
            connectToDb()
            let updatedUserData = await Users.findOneAndUpdate({"useremail":email}, {passwordResetToken:passwordResetToken}, {new:true})
            console.log(updatedUserData)
        }

        return { success: true, message: "Password reset link sent" };
    } catch (error) {
        return { success: false, message: error };
    }
}

async function resetPassword(email:string,newpass:string){
    
    const domain = process.env.NEXTAUTH_URL

    const htmlBody = `
         <p>Dear User,</p>
        <p>Your password has been successfully updated. If you did not make this change, please contact our support immediately.</p>
        <p>For your security, here are some tips:</p>
        <ul>
            <li>Do not share your password with anyone.</li>
            <li>Ensure your password is strong and unique.</li>
            <li>Change your password regularly.</li>
        </ul>
        <p>If you have any questions, feel free to <a href="mailto:info@ratemyclinic.com">contact our support team</a>.</p>
        <p>Best regards,</p>
        <p>RATE MY CLINIC Team</p>
    `;
    
    const mailOptions = {
        from: 'RATE MY CLINIC <info@ratemyclinic.com>', // Corrected email format
        to: email,
        subject: 'Password reset',
        htmlBody, // Use 'html' instead of 'htmlBody'
    };


    try {
        const res = await AppSendMail(mailOptions);
        
        if(res.success){
            connectToDb()
            let salt = bcrypt.genSaltSync(10) 
            const userpass = newpass as string;
            let hashedPass = await bcrypt.hash(userpass,salt)
            let updatedUserData = await Users.findOneAndUpdate({"useremail":email}, {password:hashedPass}, {new:true})
            console.log(updatedUserData)
        }

        return { success: true, message: "Password updated successfully" };
    } catch (error) {
        return { success: false, message: error };
    }
}