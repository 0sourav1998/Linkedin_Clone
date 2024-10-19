import nodemailer from "nodemailer";
import { createCommentNotificationEmailTemplate, createWelcomeEmailTemplate } from "../EmailTemplate/EmailTemplate.js";

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

export const commentCreationMail = async(email,receiverName,commenterName,postUrl,commentContent)=>{
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
            subject : "New Comment In Your Post",
            html : createCommentNotificationEmailTemplate(receiverName,commenterName,postUrl,commentContent)
        })
        return info ;
    } catch (error) {
        console.log(error)
    }
}

export const acceptRequestMail = async(email,receiverName,commenterName,postUrl,commentContent)=>{
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
            subject : "New Comment In Your Post",
            html : createCommentNotificationEmailTemplate(receiverName,commenterName,postUrl,commentContent)
        })
        return info ;
    } catch (error) {
        console.log(error)
    }
}