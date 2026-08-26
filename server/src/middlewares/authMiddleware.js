import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js';

dotenv.config();

export const validateToken = async (req, res, next) => {
    try {
        let token = req.cookies?.token;
        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        
        if (!token) {
            return res.status(401).json({ message: "Token not available" });
        }
        let decoded = jwt.verify(token, process.env.JWT_TOKEN);
        if (!decoded) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        let userId = decoded._id;
        const user = await UserModel.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}