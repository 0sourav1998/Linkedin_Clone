import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { acceptRequestMail } from "../utils/sendMail.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const senderId = req.params.id;
    const userId = req.user;
    if (senderId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Cannot send Request To Yourself",
      });
    }
    const existingRequest = await Connection.findOne({
      sender: senderId,
      recipient: userId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request Already Send to the Connection",
      });
    }
    const newConnection = await Connection.create({
      sender: senderId,
      recipient: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Request Send Successfully",
      newConnection,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Sending Request",
    });
  }
};

export const acceptConnectionRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user;

    const request = await Connection.findById(requestId)
      .populate("sender", "-password")
      .populate("recipient", "-password");
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection Not Found",
      });
    }
    if (userId.toString() === request.recipient.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Cannot Send Request to Yourself",
      });
    }
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Connection Request Already Been Processed",
      });
    }
    request.status = "accepted";
    await request.save();
    await User.findByIdAndUpdate(userId, {
      $push: { connections: request.sender._id },
    });
    await User.findByIdAndUpdate(request.sender._id, {
      $push: { connections: userId },
    });

    const newNotification = await Notification.create({
      recipient: request.recipient._id,
      relatedUser: userId,
      type: "ConnectionRequest",
    });

    // const senderEmail = request.sender._id ;
    // const senderName = request.sender.name ;
    // const recipientName = request.recipient.name ;
    // const profileUrl = process.env.CLIENT_URL + "/profile/" + request.recipient.username
    // await acceptRequestMail(senderEmail,senderName,recipientName,profileUrl);
    // //send mail --> 2:20min

    return res.status(200).json({
      success: true,
      message: "Request Accepted Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Accepting Request",
    });
  }
};

export const rejectConnectionRequest = async () => {
  try {
    const requestId = req.params.id;
    const userId = req.user;

    const request = await Connection.findById(requestId)
      .populate("sender", "-password")
      .populate("recipient", "-password");
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection Not Found",
      });
    }
    if (userId.toString() === request.recipient.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Cannot Send Request to Yourself",
      });
    }
    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Connection Request Already Been Processed",
      });
    }
    request.status = "rejected";
    await request.save();
    return res.status(200).json({
      success: true,
      message: "Request Rejected Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Rejecting Request",
    });
  }
};

export const getAllConnections = async (req, res) => {
  try {
    const userId = req.user;
    const connections = await Connection.find({
      $or: [{ sender: userId }, { recipient: userId }],
      status: "accepted",
    })
      .populate("recipient", "-password")
      .populate("sender", "-password");
    if (!connections) {
      return res.status(404).json({
        success: false,
        message: "No Connections Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Connections Fetched Successfully",
      connections,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Fetching Connection Requests",
    });
  }
};

export const getUserConnections = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId).populate(
      "connections",
      "-password"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Connections Fetched",
      connections: user.connections,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Fetching Connections",
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.user;
    const userId = req.params.id;
    await User.findByIdAndUpdate(myId, { $pull: { connections: userId } });
    await User.findByIdAndUpdate(userId, { $pull: { connections: myId } });
    return res.status(200).json({
      success: true,
      message: "Connection Removed Successfully",
    });
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Removing Connection",
    });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const currentUserId = req.user;
    const targetedUserId = req.params.id;
    const user = await User.findById(currentUserId);
    if (user.connections.includes(targetedUserId)) {
      return res.json({ status: "Already Connected" });
    }
    const pendingReq = await Connection.findOne({
      $or: [
        { sender: currentUserId, recipient: targetedUserId },
        { sender: targetedUserId, recipient: currentUserId },
      ],
      status: "pending",
    });
    if(pendingReq){
      if(pendingReq.sender.toString() === currentUserId.toString()){
        return res.json({ status : "pending"})
      }else{
        return res.json({status : "received", requestId : pendingReq._id})
      }
    }
    return res.json({status : "Not_Connected"})
  } catch (error) {
    console.log(error.message);
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Getting Connection Status",
    });
  }
};
