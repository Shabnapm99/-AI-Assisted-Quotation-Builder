import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email?.toLowerCase().trim();

        //validation 

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Hashing the password

        let hashedPassword = await bcrypt.hash(password, 10);

        let newUser = await UserModel.create({
            email,
            password_hash: hashedPassword,
        });

        if (!newUser) {
            return res.status(400).json({ message: "User is not created" })
        }
        return res.status(201).json({
            message: "User created successfully"
        });
    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(error.status || 500).json({
            message: "Internal server Error",
            error: error.message

        })
    }
}

//Login
export const login = async (req, res) => {
    try {

        let { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }
        email = email?.toLowerCase().trim();

        let user = await UserModel.findOne({ email: email }).select('-__v');
        
        if (!user) {
            return res.status(400).json({ message: "Incorrect email or password" })
        }

        let isMatch = await bcrypt.compare(password, user.password_hash);
        if (isMatch) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN, { expiresIn: process.env.JWT_EXPIRESIN });

            //create a cookie named token with value token and other credentials
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                partitioned: true,
            });

            return res.status(200).json({
                message: "LoggedIn successfully",
                user: {
                    _id: user._id,
                    email: user.email
                },
                token
            })
        } else {
            return res.status(400).json({ message: "The provided email or password is not matching" })
        }

    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(error.status || 500).json({
            message: "Internal server Error",
            error: error.message

        })
    }
}

//logout 
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none', 
            partitioned: true,
        });
        res.status(200).json({ message: 'Logged out successfully' })

    } catch (error) {
        console.log("Something went wrong:", error.message);
        res.status(error.status || 500).json({
            message: "Internal server Error",
            error: error.message
        })
    }
}

// Verify auth token / session
export const verifyAuth = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        res.status(200).json({
            message: "Authenticated",
            user: {
                _id: req.user._id,
                email: req.user.email
            }
        });
    } catch (error) {
        console.log("Verify auth error:", error.message);
        res.status(401).json({ message: "Invalid or expired session" });
    }
};