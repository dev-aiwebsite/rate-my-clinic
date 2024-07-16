import { NextRequest, NextResponse } from "next/server";
import { transporter } from "../../../../config/nodemailer.config";
import { AppSendMail } from "@/server-actions";
import {ApiClient, BodyPart, EmailMessageData, EmailRecipient, EmailsApi} from "@elasticemail/elasticemail-client";
import { error } from "console";

export async function POST(req:NextRequest, res: NextResponse){
    const payload = await req.text()
    const response =  JSON.parse(payload)

    const {from,to,subject,htmlBody} = response
    try {
        await transporter.sendMail({
            from: 'RATE MY CLINIC <info@ratemyclinic@gmail.com>',
            to,
            subject,
            html: htmlBody

        })

        return NextResponse.json({status: "success", message: "test"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({status: "failed", message: error})
    }
}

export async function GET(req:NextRequest, res: NextResponse){
    let mailOptions = {
      to:'dev@aiwebsiteservices.com',
      Subject: 'Password reset email test',
      templateName: 'Password reset email',
      dynamicFields: {
            firstname: 'dev',
          "resetLink": 'https://aiwebsiteservices.com'
      }
    }
    const emailResult = await AppSendMail(mailOptions)

    return NextResponse.json(emailResult)
}


