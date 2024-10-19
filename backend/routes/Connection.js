import express from "express";
const router = express.Router();
import {isAuthenticated} from "../middlewares/isAuthenticated.js"
import { acceptConnectionRequest, getAllConnections, getConnectionStatus, getPendingRequest, getUserConnections, rejectConnectionRequest, removeConnection, sendConnectionRequest, showAllConnections } from "../controllers/Connection.js";

router.post("/request/:id",isAuthenticated,sendConnectionRequest);
router.put("/accept/:id",isAuthenticated,acceptConnectionRequest);
router.put("/reject/:id",isAuthenticated,rejectConnectionRequest);
router.get("/getAll",isAuthenticated,getAllConnections);
router.get("/userConnections",isAuthenticated,getUserConnections);
router.delete("/removeConnection/:id",isAuthenticated,removeConnection);
router.get("/status/:id",isAuthenticated,getConnectionStatus)
router.get("/allConnections",isAuthenticated,showAllConnections)

router.get("/getPendingRequest",isAuthenticated,getPendingRequest)

export default router;
