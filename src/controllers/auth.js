import { checkIfUserExists } from "../models/auth.js";
import { register } from "../models/auth.js";
import { login } from "../models/auth.js";
import { reset } from "../models/auth.js";

export async function registerPerson(req, res, next) {
  try {
    const data = await register(req.body);
    if (!data) {
      res.json("USERNAME EXISTS");
    } else {
      console.log(data)
      res.json({ message: "REGISTRATION SUCESSFULL", data });
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
