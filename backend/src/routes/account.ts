import express from "express";
import { Account } from "../db";
import ConnectDb from "../conn";
import mongoose , {ObjectId, Types} from "mongoose";
import { Authorize } from "../middleaware";
export const accountRouter = express.Router();
ConnectDb()
accountRouter.get("/balance",Authorize, async (req, res): Promise<any> => {
  try {
    const userId = req.userId;
    console.log(userId);
    const account = await Account.findOne({  userId });
    if (!account)
      return res.status(404).json({
        message: "Account not found",
      });
    const balance = account.balance;
    res.status(200).json({
      balance: balance,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
});
accountRouter.post("/transfer",Authorize, async (req, res): Promise<any> => {
  const session = await mongoose.startSession()
  session.startTransaction();
try {
  const {to, amount} = req.body;
  const userId = req.userId;
  const fromAccount = await Account.findOne({ userId });
  if (!fromAccount || fromAccount.balance < amount) {
    await session.abortTransaction();
    return res.status(404).json({
      message: "Insufficient balance/ not a valid account",
    });
  }
  const toAccount = await Account.findOne({ userId: to });
  if (!toAccount) {
    await session.abortTransaction();
    return res.status(404).json({
      message: "Account not found",
    });
  }
await Account.findOneAndUpdate({userId:req.userId},{$inc:{balance:-amount}}).session(session)
await Account.findOneAndUpdate({userId:to},{$inc:{balance:amount}}).session(session)
  await session.commitTransaction();
  res.status(200).json({
    message: "Transfer successful",
  });
} catch (error) {
  await session.abortTransaction();
  res.status(500).json({
    message: "Internal server error",
  });
} finally {
  session.endSession();
}
});
