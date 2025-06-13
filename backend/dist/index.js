"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const routes_1 = require("./routes");
const user_1 = require("./routes/user");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/api/v1", routes_1.router);
app.use("/api/v1/user", user_1.userRouter);
app.listen(3000);
