import nodemailer from "nodemailer";
import { createWelcomeEmailTemplate } from "../EmailTemplate/EmailTemplate.js";

export const sendMail = async(email,name,profileUrl)=>{
    try {
        const transporter = nodemailer.createTransport({
            host : process.env.MAIL_HOST,
            auth : {
                user : process.env.MAIL_USER,
                pass : process.env.MAIL_PASS
            }
        })
        const info = await transporter.sendMail({
            from : "Linkedin:-Social Media Platform",
            to: `${email}`,
            title : `Welcome To Linkedin`,
            subject : "Registration Successfully",
            html : createWelcomeEmailTemplate(name,profileUrl)
        })
        return info ;
    } catch (error) {
        console.log(error)
    }
}