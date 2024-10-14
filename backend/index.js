import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import {cloudinaryConfig} from "./Cloudinary/config.js"
dotenv.config();
import userRouter from "./routes/User.js"
import dbConnect from "./Database/db.js"
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

const app = express();

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.use("/api/v1/user",userRouter);


dbConnect();
cloudinaryConfig().then(()=>console.log("Cloudinary Connected Successfully"))

app.listen(PORT,()=>{
    console.log(`App is Listening to PORT : ${PORT}`)
})