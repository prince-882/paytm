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
exports.Authorize = Authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function Authorize(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token || !((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.startsWith('Bearer'))) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        try {
            if (!process.env.JWT_SECRET)
                return res.json({ message: "no secret" });
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            req.userId = decoded.userId;
            return next();
        }
        catch (error) {
            return res.status(403).json({ message: "Invalid token" });
        }
    });
}
