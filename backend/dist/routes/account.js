"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.accountRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
const conn_1 = __importDefault(require("../conn"));
const mongoose_1 = __importDefault(require("mongoose"));
const middleaware_1 = require("../middleaware");
exports.accountRouter = express_1.default.Router();
(0, conn_1.default)();
exports.accountRouter.get("/balance", middleaware_1.Authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log(userId);
        const account = yield db_1.Account.findOne({ userId });
        if (!account)
            return res.status(404).json({
                message: "Account not found",
            });
        const balance = account.balance;
        res.status(200).json({
            balance: balance,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
exports.accountRouter.post("/transfer", middleaware_1.Authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { to, amount } = req.body;
        const userId = req.userId;
        const fromAccount = yield db_1.Account.findOne({ userId });
        if (!fromAccount || fromAccount.balance < amount) {
            yield session.abortTransaction();
            return res.status(404).json({
                message: "Insufficient balance/ not a valid account",
            });
        }
        const toAccount = yield db_1.Account.findOne({ userId: to });
        if (!toAccount) {
            yield session.abortTransaction();
            return res.status(404).json({
                message: "Account not found",
            });
        }
        yield db_1.Account.findOneAndUpdate({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        yield db_1.Account.findOneAndUpdate({ userId: to }, { $inc: { balance: amount } }).session(session);
        yield session.commitTransaction();
        res.status(200).json({
            message: "Transfer successful",
        });
    }
    catch (error) {
        yield session.abortTransaction();
        res.status(500).json({
            message: "Internal server error",
        });
    }
    finally {
        session.endSession();
    }
}));
