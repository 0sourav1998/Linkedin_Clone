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
      process.env.CLIENT_URL + "/profile/" + createUser.username;
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
    const user = await User.findOne({ username }).populate(
      "connections",
      "-password"
    );
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
      user,
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
    const user = await User.findById(id).populate("connections", "-password");
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
    const userId = req.user;
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
    const { experience, education , skills , ...newProfileData } = req.body;
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }

    let profilePicResponse;
    if (req.files && req?.files?.profilePicture) {
      const { profilePicture } = req?.files;
      const response = await sendFileToCloudinary(
        profilePicture,
        process.env.CLOUD_FOLDER
      );
      if (response) {
        profilePicResponse = response.secure_url;
      }
    }

    let bannerPicResponse;
    if (req.files && req?.files?.bannerImage) {
      const { bannerImage } = req?.files;
      const response = await sendFileToCloudinary(
        bannerImage,
        process.env.CLOUD_FOLDER
      );
      if (response) {
        bannerPicResponse = response.secure_url;
      }
    }

    let updatedExperience = user.experience || [];
    let updateEducation = user.education || [] ;
    let updateSkill = user.skills || []

    if (experience) {
      let newExperience = Array.isArray(experience)
        ? experience
        : [experience];

      updatedExperience.push(...newExperience);
    }

    if (education) {
      let newEducation = Array.isArray(education)
        ? education
        : [education];

      updateEducation.push(...newEducation);
    }

    if (skills) {
      let newSkill = Array.isArray(skills)
        ? skills
        : [skills];

      updateSkill.push(...newSkill);
    }

    const newData = {
      ...newProfileData,
      profilePicture: profilePicResponse
        ? profilePicResponse
        : user?.profilePicture,
      bannerImage: bannerPicResponse
        ? bannerPicResponse
        : user?.bannerImage,
      experience: updatedExperience,
      education : updateEducation ,
      skills : updateSkill
    };

    Object.assign(user, newData);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile Updated",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error While Updating Profile",
    });
  }
};

export const deleteExp = async(req,res)=>{
  try {
    const {id} = req.params;
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const updatedProfile = user.experience.filter((exp)=>exp._id.toString() !== id);
    user.experience = updatedProfile;
    await user.save();
    return res.status(200).json({
      success : true ,
      message : "Experience Deleted",
      user
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error While Deleting Experience",
    });
  }
}

export const deleteEducation = async(req,res)=>{
  try {
    const {id} = req.params;
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const updatedProfile = user.education.filter((edu)=>edu._id.toString() !== id);
    user.education = updatedProfile;
    await user.save();
    return res.status(200).json({
      success : true ,
      message : "Education Deleted",
      user
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error While Deleting Education",
    });
  }
}

export const deleteSkill = async(req,res)=>{
  try {
    const {skill} = req.params;
    const userId = req.user;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const updatedProfile = user.skills.filter((s)=>s !== skill);
    user.skills = updatedProfile;
    await user.save();
    return res.status(200).json({
      success : true ,
      message : "Skill Deleted",
      user
    })
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Error While Deleting Skill",
    });
  }
}

export const getAllExceptLoggedInUser = async(req,res)=>{
  try {
    const userId = req.user ;
    const user = await User.findById(userId);
    const allUser = await User.find({_id : {$ne : user._id}}).select("-password");
    return res.status(200).json({
      success : true ,
      message : "Users Fetched",
      allUser
    })
  } catch (error) {
    return res.status(400).json({
      success : false ,
      message : "Something Went Wrong While Fetching Users"
    })
  }
}