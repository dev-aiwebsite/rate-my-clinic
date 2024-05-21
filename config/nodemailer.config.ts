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

export interface MailOptions {
    from: string;
    to: string;
    subject: string;
    htmlBody: string;
}
export const defaultEmailOption = {
    from: 'RATE MY CLINIC <info@ratemyclinic@gmail.com>',
}