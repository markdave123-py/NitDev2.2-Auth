import { checkIfUserExists } from "../models/auth.js";
import { register } from "../models/auth.js";
import { login } from "../models/auth.js";
import { sendResetLink } from "../models/auth.js";

export async function registerPerson(req, res, next) {
  try {
    const data = await register(req.body);
    if (!data) {
      res.status(400).json("USERNAME EXISTS or INVALID REQUEST");
    } else {
      console.log(data)
      res.status(201).json({ message: "REGISTRATION SUCESSFULL", data });
    }
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error)
  }
}

export async function logPerson(req, res) {
  try {
    const data = await login(req.body);
    if (data) {
      
      res.cookie("token", data, { httpOnly: true })
      res.status(200).json({ 
        message: "LOGIN SUCCESSFUL",
        token: data
      });
    } else {
      res.status(403).json({ message: "INVALID USERNAME OR PASSWORD" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function sendlink(req, res, next) {
  try {
    const data = await sendResetLink(req.body);

    if (data === false) {

      res.json({ message: "INVALID USERNAME " }); 

    } else {
      res.json({ 
        message: "PASSWORD RESET LINK SENT", 
        response: data 
      });
    }
  } catch (error) {
    // res.status(500).json({ message: error.message });
    next(error)
    
  }
}

export async function resetPassword(req, res) {
  try {
    const data = await reset(req.body);
    if (data) {
      res.json({ message: "PASSWORD SUCCESSFULLY RESET", data });
    } else {
      res.json({ message: "INVALID USERNAME OR PASSWORD" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token");
    res.json({ message: "LOGOUT SUCCESSFUL" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
