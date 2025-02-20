import User from '../models/user.model.js';
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){ // First check if Token exists
            return res.status(401).json({error: "Unauthorized: no token provided"});
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded){ // check if Token is valid
            return res.status(401).json({error: "Unauthorized: Invalid Token"});
        }
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){ // This is a rare thing to happen but we check if the user doesn't exist :) 
                return res.status(404).json({error: "User not found"})
        }

        req.user = user; // we put the user field to the request

        next(); // This will call the next method (here getMe) after all checks are done :) (check the auth.routes.js -> router.get("/me", protectRoute, getMe);)

    } catch (err) {
        console.log("Error in protectRoute middleware", err.message);
        return res.status(500).json({error: "Internal Sever Error"});
        
    }
}