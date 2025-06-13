import express from "express";
import ConnectDb from "../conn";
import { Account, User } from "../db";
export const userRouter = express.Router();
import "dotenv/config";
import bcrypt from "bcrypt";
import zod from "zod";
import { resourceUsage } from "process";
ConnectDb();
import jwt from "jsonwebtoken";
import { Authorize } from "../middleaware";
const signUpBody = zod.object({
  username: zod.string(),
  firstname: zod.string(),
  lastname: zod.string(),
  password: zod.string(),
});
const signinBody = zod.object({
  username: zod.string(),
  password: zod.string(),
});
userRouter.post("/signup", async (req, res): Promise<any> => {
  try {
    const { success } = signUpBody.safeParse(req.body);
    if (!success) {
      return res.status(412).json({
        message: "Invalid Inputs",
      });
    }
    const { username, password, firstname, lastname } = req.body;
    const existinguser = await User.findOne({ username });
    if (existinguser) {
      return res.status(412).json({
        message: "User already exists",
      });
    }
    const user = await new User({
      username,
      firstname,
      lastname,
    });
    const newpass = await user.createHash(password);
    user.password = newpass;
    await user.save();
    const balance = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET as string
    );
    Account.insertOne({
      userId: user._id,
      balance,
    });
    res.status(201).json({
      message: "User created successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

userRouter.post("/signin", async (req, res): Promise<any> => {
  try {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
      return res.status(411).json({
        message: "Invalid Inputs",
      });
    }
    const { username, password } = req.body;
    const existinguser = await User.findOne({ username });
    if (!existinguser) {
      return res.status(411).json({
        message: "User does not exist",
      });
    }
    const isPasswordValid = await existinguser.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
    const token = jwt.sign(
      { userId: existinguser._id },
      process.env.JWT_SECRET as string
    );
    res.status(200).json({
      token,
    });
  } catch (error) {
    res.status(411).json({
      message: "Internal server error",
    });
    console.log(error);
    
  }
});
const updateBody = zod.object({
  firstname: zod.string().optional(),
  lastname: zod.string().optional(),
  password: zod.string().optional(),
});
userRouter.put("/",Authorize, async (req, res): Promise<any> => {
  const success = updateBody.parse(req.body);
  if (!success) {
    return res.status(411).json({
      message: "Invalid Inputs",
    });
  }
  try {
    const { firstname, lastname, password } = req.body;
    const user = await User.findById(req.userId);
    const newpass = user.createHash(password);
    await User.findOneAndUpdate(
      {
        _id: req.userId,
      },
      {
        firstname,
        lastname,
        password: newpass,
      }
    );
  } catch (error) {
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});
userRouter.get("/bulk",Authorize, async (req, res): Promise<any> => {
  try {
    const { firstname } = req.query;
    const users = await User.find({ $or: [{ firstname }] });
    res.json({
      users: users.map((user) => {
        return {
          firstname: user.firstname,
          lastname: user.lastname,
          username: user.username,
          _id: JSON.stringify(user._id),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
