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
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const conn_1 = __importDefault(require("../conn"));
const db_1 = require("../db");
exports.userRouter = express_1.default.Router();
require("dotenv/config");
const zod_1 = __importDefault(require("zod"));
(0, conn_1.default)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const middleaware_1 = require("../middleaware");
const signUpBody = zod_1.default.object({
    username: zod_1.default.string(),
    firstname: zod_1.default.string(),
    lastname: zod_1.default.string(),
    password: zod_1.default.string(),
});
const signinBody = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signUpBody.safeParse(req.body);
        if (!success) {
            return res.status(412).json({
                message: "Invalid Inputs",
            });
        }
        const { username, password, firstname, lastname } = req.body;
        const existinguser = yield db_1.User.findOne({ username });
        if (existinguser) {
            return res.status(412).json({
                message: "User already exists",
            });
        }
        const user = yield new db_1.User({
            username,
            firstname,
            lastname,
        });
        const newpass = yield user.createHash(password);
        user.password = newpass;
        yield user.save();
        const balance = Math.floor(Math.random() * 1000) + 1; // Random amount between 1 and 1000
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET);
        db_1.Account.insertOne({
            userId: user._id,
            balance,
        });
        res.status(201).json({
            message: "User created successfully",
            token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { success } = signinBody.safeParse(req.body);
        if (!success) {
            return res.status(411).json({
                message: "Invalid Inputs",
            });
        }
        const { username, password } = req.body;
        const existinguser = yield db_1.User.findOne({ username });
        if (!existinguser) {
            return res.status(411).json({
                message: "User does not exist",
            });
        }
        const isPasswordValid = yield existinguser.validatePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid username or password",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: existinguser._id }, process.env.JWT_SECRET);
        res.status(200).json({
            token,
        });
    }
    catch (error) {
        res.status(411).json({
            message: "Internal server error",
        });
        console.log(error);
    }
}));
const updateBody = zod_1.default.object({
    firstname: zod_1.default.string().optional(),
    lastname: zod_1.default.string().optional(),
    password: zod_1.default.string().optional(),
});
exports.userRouter.put("/", middleaware_1.Authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const success = updateBody.parse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Invalid Inputs",
        });
    }
    try {
        const { firstname, lastname, password } = req.body;
        const user = yield db_1.User.findById(req.userId);
        const newpass = user.createHash(password);
        yield db_1.User.findOneAndUpdate({
            _id: req.userId,
        }, {
            firstname,
            lastname,
            password: newpass,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}));
exports.userRouter.get("/bulk", middleaware_1.Authorize, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstname } = req.query;
        const users = yield db_1.User.find({ $or: [{ firstname }] });
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
    }
    catch (error) {
        res.status(500).json({
            message: "Internal server error",
        });
    }
}));
