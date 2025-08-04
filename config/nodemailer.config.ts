import nodemailer from 'nodemailer'

const email = process.env.GMAIL_EMAIL
const pass = process.env.GMAIL_PASS

export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    auth: {
        user: email,
        pass: pass
    }
})

const elastic_email = process.env.ELASTIC_EMAIL
const elatic_pass = process.env.ELASTIC_PASS
export const elasticTransporter = nodemailer.createTransport({
    host: 'smtp.elasticemail.com',
    auth: {
        user: elastic_email,
        pass: elatic_pass
    }
})



export interface MailOptions {
    from?: string;
    to: string[];
    cc?: string[];
    bcc?: string[]; 
    name?: string;
    subject?: string;
    htmlBody?: string;
    templateName?: string;
    dynamicFields?: { [key: string]: string };
    sendTime?: Date;
}
export const defaultEmailOption = {
    from: 'RATE MY CLINIC <info@ratemyclinic@gmail.com>',
}

