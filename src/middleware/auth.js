import { verifyToken } from "../utils/jwt.js";

export const authUser = (req, res, next) => {

    // const token = req.cookies.token;
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    console.log(token)
    
    if (!token) {
        return res.status(401).json({ message: "UNAUTHORIZED" });
    }
    
    // jwt.verify(token, config.ACCESSTOKEN_SECRET, (err, decoded) => {
    //     if (err) {
    //     return res.status(403).json({ message: "INVALID TOKEN" });
    //     }
    //     req.user = decoded;
    //     next();
    // });

    try {

        const decoded = verifyToken(token);
        req.user = decoded;
        next();
        
    } catch (error) {
       return  res.status(403).json({ message: "INVALID TOKEN" });
        // next(error)
    }
}