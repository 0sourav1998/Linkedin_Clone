import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { acceptRequestMail } from "../utils/sendMail.js";

export const sendConnectionRequest = async (req, res) => {
  try {
    const receivedId = req.params.id;
    const userId = req.user;
    if (receivedId.toString() === userId.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Cannot send Request To Yourself",
      });
    }
    const existingRequest = await Connection.findOne({
      sender: userId,
      receiver: receivedId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Request Already Send to the Connection",
      });
    }
    const newConnection = await Connection.create({
      sender: userId,
      receiver: receivedId,
    });
    const populatedConnection = await Connection.findById(newConnection._id)
      .populate("sender", "-password")
      .populate("receiver", "-password");
    return res.status(200).json({
      success: true,
      message: "Request Send Successfully",
      populatedConnection,
    });
  } catch (error) {
    
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
      .populate("receiver", "-password");
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection Not Found",
      });
    }
    if (userId.toString() === request.receiver.toString()) {
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
    const updatedUserWithConnection = await User.findByIdAndUpdate(
      userId,
      {
        $push: { connections: request.sender._id },
      },
      { new: true }
    ).populate("connections", "-password");

    await User.findByIdAndUpdate(
      request.sender._id,
      {
        $push: { connections: userId },
      },
      { new: true }
    );

    const newNotification = await Notification.create({
      receiver: request.sender._id,
      relatedUser: request.receiver._id,
      type: "ConnectionRequest",
    });

    // const senderEmail = request.sender._id ;
    // const senderName = request.sender.name ;
    // const receiverName = request.receiver.name ;
    // const profileUrl = process.env.CLIENT_URL + "/profile/" + request.receiver.username
    // await acceptRequestMail(senderEmail,senderName,receiverName,profileUrl);
    // //send mail --> 2:20min

    return res.status(200).json({
      success: true,
      message: "Request Accepted Successfully",
      request,
      updatedUserWithConnection,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Accepting Request",
    });
  }
};

export const rejectConnectionRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const userId = req.user;

    const request = await Connection.findById(requestId)
      .populate("sender", "-password")
      .populate("receiver", "-password");
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection Not Found",
      });
    }
    if (userId.toString() === request.receiver.toString()) {
      return res.status(400).json({
        success: false,
        message: "You Cannot Reject Request to Yourself",
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
      request,
    });
  } catch (error) {
    
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
      $or: [{ sender: userId }, { receiver: userId }],
      status: "accepted",
    })
      .populate("receiver", "-password")
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
    // const user = await User.findById(currentUserId);
    // if (user.connections.includes(targetedUserId)) {
    //   return res.json({ status: "Already Connected" });
    // }
    const connections = await Connection.find({
      $or: [
        { sender: currentUserId, receiver: targetedUserId },
        { sender: targetedUserId, receiver: currentUserId },
      ]
    });
    return res.status(200).json({
      success : true ,
      message : "Connections Fetched Successfully",
      connections
    })
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Getting Connection Status",
    });
  }
};

export const showAllConnections = async (req, res) => {
  try {
    const userId = req.user;
    const allConnections = await Connection.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate("sender", "-password")
      .populate("receiver", "-password");
    return res.status(200).json({
      success: true,
      allConnections,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Getting Connections",
    });
  }
};

export const getPendingRequest = async (req, res) => {
  try {
    const userId = req.user;
    const pendingConnections = await Connection.find({
      receiver: userId,
      status: "pending",
    }).populate("sender", "-password");
    return res.status(200).json({
      success: true,
      message: "Pending Requests Fetched Successfully",
      pendingConnections,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong while Fetching Pending Connections",
    });
  }
};
