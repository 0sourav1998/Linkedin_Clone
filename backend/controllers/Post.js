import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
import User from "../models/User.js";
import { sendFileToCloudinary } from "../utils/sendFileToCloudinary.js";
import { commentCreationMail } from "../utils/sendMail.js";

export const getFeeds = async (req, res) => {
  try {
    const id = req.user;
    const user = await User.findById(id);
    const posts = await Post.find({})
      .populate("author", "-password")
      .populate("comments.user", "-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "Feeds Fetched Successfully",
      posts,
    });
  } catch (error) {
    

    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Fetching Feeds",
    });
  }
};

export const createPost = async (req, res) => {
  try {
    const user = req.user;
    const { content } = req.body;
    let imageUrl;
    if (req.files) {
      const { image } = req.files;
      const response = await sendFileToCloudinary(
        image,
        process.env.CLOUD_FOLDER
      );
      imageUrl = response.secure_url;
    }
    const newPost = await Post.create({
      author: user,
      content,
      image: imageUrl || null,
    });

    await newPost.populate([
      { path: "author", select: "-password" },
      { path: "comments.user", select: "-password" },
    ]);

    return res.status(201).json({
      success: true,
      message: "Post Created Successfully",
      newPost,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Fetching Feeds",
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "You Are Not The Owner Of the Post",
      });
    }
    // if(post.image){
    //     // todo
    // }
    const deletedPost = await Post.findByIdAndDelete(postId);
    return res.status(200).json({
      success: true,
      message: "Post Deleted Successfully",
      deletedPost,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Deleting Posts",
    });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "-password")
      .populate("comments.user", "-password");
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Post Fetched Successfully",
      post,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Fetching Post",
    });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user;
    const { content } = req.body;
    if (!postId || !content) {
      return res.status(400).json({
        success: false,
        message: "All Fields Are Required",
      });
    }
    const user = await User.findById(userId);
    const post = await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: { user: userId, content: content } } },
      { new: true }
    )
      .populate("author", "-password")
      .populate("comments.user", "-password")
      .sort({ createdAt: -1 });
    if (userId.toString() !== post.author._id.toString()) {
      await Notification.create({
        receiver: post.author,
        type: "Comment",
        relatedUser: userId,
        relatedPost: postId,
      });
    }
    try {
      const postUrl = process.env.CLIENT_URL + "/post/" + postId;
      await commentCreationMail(
        post.author.email,
        post.author.name,
        user.name,
        postUrl,
        content
      );
    } catch (error) {
      console.error(error);
    }
    return res.status(201).json({
      success: true,
      message: "Comment Created",
      post,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Creating Comment",
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const userId = req.user;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post Not Found",
      });
    }
    let updatedPost;
    if (post.likes.includes(userId)) {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $push: { likes: userId } },
        { new: true }
      ).populate("author","-password");
      if (post.author.toString() !== userId.toString()) {
        await Notification.create({
          receiver: post.author,
          type: "Like",
          relatedUser: userId,
          relatedPost: postId,
        });
      }
    }
    return res.status(200).json({
      success: true,
      message: post.likes.includes(userId) ? "Post Disliked" : "Post Liked",
      updatedPost,
    });
  } catch (error) {
    
    return res.status(400).json({
      success: false,
      message: "Something Went Wrong While Liking the Post",
    });
  }
};
