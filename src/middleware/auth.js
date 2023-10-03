import { config } from "../config/env.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {

    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "UNAUTHORIZED" });
    }
    
    jwt.verify(token, config.ACCESSTOKEN_SECRET, (err, decoded) => {
        if (err) {
        return res.status(403).json({ message: "INVALID TOKEN" });
        }
        req.user = decoded;
        next();
    });
}