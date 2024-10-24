import Notification from "../models/Notification.js";

export const getAllNotifications = async (req, res) => {
  try {
    const userId = req.user;
    const notification = await Notification.find({ receiver: userId })
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");
    return res.status(200).json({
      success: true,
      message: "Notification Fetched",
      notification,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Fetching Notifications",
    });
  }
};

export const markNotificationAsRead = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user;
    const updatedNotification = await Notification.findOneAndUpdate(
      { _id: notificationId, receiver: userId },
      { read: true },
      { new: true }
    )
      .populate("relatedUser", "name username profilePicture")
      .populate("relatedPost", "content image");
    return res.status(200).json({
      success: true,
      message: "Marked As Read",
      updatedNotification,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Updating Notification",
    });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user;
    const deletedNotification = await Notification.findOneAndDelete({
      _id: notificationId,
      receiver: userId,
    });
    return res.status(200).json({
      success: true,
      message: "Notification Deleted Successfully",
      deletedNotification,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Deleting Notification",
    });
  }
};
