import express from "express"
import { login, logout, signup , getCurrentUser, suggestedUser, getProfile, updateProfile, deleteExp, deleteEducation, deleteSkill, getAllExceptLoggedInUser } from "../controllers/User.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.get("/getCurrentUser",isAuthenticated,getCurrentUser)
router.get("/getAllUser",isAuthenticated,getAllExceptLoggedInUser)

router.get("/suggestedUsers",isAuthenticated,suggestedUser);
router.get("/:username",isAuthenticated,getProfile)
router.put("/update",isAuthenticated,updateProfile)

router.delete("/delete/exp/:id",isAuthenticated,deleteExp)
router.delete("/delete/edu/:id",isAuthenticated,deleteEducation)
router.delete("/delete/skill/:skill",isAuthenticated,deleteSkill)


export default router ;
