import { NextRequest, NextResponse } from "next/server";
import { transporter } from "../../../../config/nodemailer.config";
import { AppSendMail } from "@/server-actions";

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
    testEmail()
}

async function testEmail(){
    const testMailOptions = {
        from: 'RATE MY CLINIC <info@ratemyclinic@gmail.com>',
        to: process.env.GMAIL_EMAIL || 'info@ratemyclinic@gmail.com',
        subject: 'test email rmc',
        htmlBody: 'test'
    }
    
    try {
        
        const res = await AppSendMail(testMailOptions)
        console.log(res)
        return NextResponse.json({status: "success", message: "test"})
    } catch (error) {
        console.log(error)
        return NextResponse.json({status: "failed", message: error})
    }
}