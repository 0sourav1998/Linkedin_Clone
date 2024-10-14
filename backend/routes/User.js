import express from "express"
import { login, logout, signup , getCurrentUser, suggestedUser, getProfile, updateProfile } from "../controllers/User.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/getCurrentUser",isAuthenticated,getCurrentUser)

router.get("/suggestedUsers",isAuthenticated,suggestedUser);
router.get("/:username",isAuthenticated,getProfile)
router.put("/update",isAuthenticated,updateProfile)

export default router ;
