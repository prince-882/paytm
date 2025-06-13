import express from "express";
import {User} from "./db"; 
import 'dotenv/config'
import cors from 'cors';
import ConnectDb from "./conn";
import { router } from "./routes";
import { userRouter } from "./routes/user";
const app = express();
app.use(cors())
app.use(express.json());

app.use(cors());
app.use("/api/v1",router)
app.use("/api/v1/user", userRouter);
app.listen(3000)
