import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { cloudinaryConfig } from "./Cloudinary/config.js";
dotenv.config();
import dbConnect from "./Database/db.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

import userRouter from "./routes/User.js";
import postRouter from "./routes/Post.js";
import notificationRouter from "./routes/Notification.js";
import connectionRouter from "./routes/Connection.js";

const app = express();

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 4000;

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/connection", connectionRouter);

dbConnect();
cloudinaryConfig().then(() => console.log("Cloudinary Connected Successfully"));

app.listen(PORT, () => {
  console.log(`App is Listening to PORT : ${PORT}`);
});
