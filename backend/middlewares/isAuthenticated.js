import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token =
      req?.cookies?.token ||
      req?.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Token Not Found",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(400).json({
        success: false,
        message: "Token Invalid",
      });
    }
    req.user = decoded._id;
    next();
  } catch (error) {
    console.log(error.message);
  }
};
