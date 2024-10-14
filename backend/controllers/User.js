import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../utils/sendMail.js";
import jwt from "jsonwebtoken";
import { sendFileToCloudinary } from "../utils/sendFileToCloudinary.js";

export const signup = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User Already Exists",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be greater then 6 characters",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createUser = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });
    const profileUrl =
      process.env.PROFILE_URL + "/profile/" + createUser.username;
    await sendMail(createUser.email, createUser.name, profileUrl);
    return res.status(201).json({
      success: true,
      message: "User Registered Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Signing up" + error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Does not Exists",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const payload = {
      _id: user._id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });
    const options = {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000,
    };
    return res.cookie("token", token, options).status(200).json({
      success: true,
      message: "User Logged In Successfully",
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while Logging In" + error.message,
    });
  }
};

export const logout = async (req, res) => {
  return res.clearCookie("token").status(200).json({
    success: true,
    message: "Logged Out Successfully",
  });
};

export const getCurrentUser = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: true,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Fetched Successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "Something went wrong while fetching current user" + error.message,
    });
  }
};

export const suggestedUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    const otherUser = await User.find({
      _id: { $ne: userId, $nin: user.connections },
    })
      .select("-password")
      .limit(3);
    return res.status(200).json({
      success: true,
      message: "Suggested User Fetched Successfully",
      otherUser,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message:
        "Something went wrong while fetching Suggested user" + error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
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
      message: "Profile Fetched Successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something went wrong while fetching profile" + error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { ...newProfileData } = req.body;
    console.log(newProfileData)
    const { profilePicture, bannerImage } = req.files;

    let profilePicResponse;
    if (profilePicture) {
      const response = await sendFileToCloudinary(
        profilePicture,
        process.env.CLOUD_FOLDER
      );
      if (response) {
        console.log(response);
        profilePicResponse = response.secure_url;
      }
    }
    let bannerPicResponse;
    if (bannerImage) {
      const response = await sendFileToCloudinary(
        bannerImage,
        process.env.CLOUD_FOLDER
      );
      if (response) {
        console.log(response);
        bannerPicResponse = response.secure_url;
      }
    }

    const newData = {
      ...newProfileData,
      profilePicture: profilePicResponse,
      bannerImage: bannerPicResponse,
    };
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    Object.assign(user, newData);
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Profile Updated",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error While Updating Profile",
    });
  }
};
