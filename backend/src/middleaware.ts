import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: any; // Use 'any' to avoid JwtPayload type error
    }
  }
}

export async function Authorize(req: Request, res: Response, next: NextFunction):Promise<any> {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !req.headers.authorization?.startsWith('Bearer')) {
        return res.status(403).json({ message: "Unauthorized" });
    }
    try {
      if (!process.env.JWT_SECRET) return res.json({message:"no secret"});
        const decoded : jwt.JwtPayload = jwt.verify(token, process.env.JWT_SECRET ) as jwt.JwtPayload;
        req.userId = decoded.userId;
        return next();
    } catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
}

