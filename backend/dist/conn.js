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
exports.default = ConnectDb;
const mongoose_1 = __importDefault(require("mongoose"));
require("dotenv/config");
// @ts-ignore
let cached = global.mongoose || { conn: null, promise: null };
function ConnectDb() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cached.conn)
            return cached.conn;
        if (!cached.promise) {
            // @ts-ignore
            cached.promise = yield mongoose_1.default.connect(process.env.MONGODB_URI);
        }
        try {
            cached.conn = yield cached.promise;
        }
        catch (error) {
            console.error("Error Connecting To MongoDB", error);
        }
        return cached.conn;
    });
}
