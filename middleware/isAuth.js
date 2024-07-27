import jwt from "jsonwebtoken";
import {User} from '../model/User.js';

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token)
      return res.status(403).json({
        message: "Please Login",
      });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decodedData._id);
    console.log(req.user);

    next();
  } catch (error) {
    res.status(400).json({
      message: "Login First",
    });
  }
};

export const isAdmin = async (req, res, next) => {
  try {
    if(req.user.role !== 'Admin') res.status(403).json({
      message: "You are not Admin."
    })
    next();
  } catch (error) {
    res.status(400).json({
      message: "Login First",
    });
  }
};
