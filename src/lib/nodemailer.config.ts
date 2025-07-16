import {createTransport, getTestMessageUrl} from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = createTransport({
    service: "gmail",
    auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASSWORD
    }
});

interface NodemailerProps{
    to: string,
    subject: string,
    html: string
};

export const sendMail =async({to, subject, html}: NodemailerProps)=>{
    const info = await transporter.sendMail({to, subject, html, from: "sinkansen auth" });
    const testMailUrl = getTestMessageUrl(info);
    console.log(testMailUrl);
};