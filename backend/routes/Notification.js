import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { deleteNotification, getAllNotifications, markNotificationAsRead } from "../controllers/Notification.js";
const router = express.Router();

router.get("/getAll",isAuthenticated,getAllNotifications);
router.put("/:id",isAuthenticated,markNotificationAsRead);
router.delete("/delete/:id",isAuthenticated,deleteNotification)


export default router ;