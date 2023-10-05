import express from "express";
const authRoute = express.Router();

import { registerPerson } from "../controllers/auth.js";
import { logPerson } from "../controllers/auth.js";
import { resetPassword } from "../controllers/auth.js";
import { sendlink } from "../controllers/auth.js";
import { logout } from "../controllers/auth.js";
import { authUser } from "../middleware/auth.js";


authRoute.post("/register",registerPerson);
authRoute.post("/login", logPerson);
authRoute.post("/send-Reset-link", sendlink);
authRoute.put("/reset-password", resetPassword);
authRoute.delete("/logout", logout);

export default authRoute;
