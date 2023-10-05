import jwt from "jsonwebtoken";
import { config } from "../config/env.js";



export async function generateToken(payload) {
  const generatedToken = jwt.sign(payload, config.ACCESSTOKEN_SECRET, { expiresIn: "4h" });
  return generatedToken;
}

export async function verifyToken(generatedToken) {
  return jwt.verify(generatedToken, config.ACCESSTOKEN_SECRET);
}
