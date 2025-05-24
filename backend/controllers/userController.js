import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


// Register a new user : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({success:false, message: "Please fill all the required fields" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({success:false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});
        res.cookie("token", token, {
            httpOnly: true, // Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookie in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // SameSite attribute for CSRF protection
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days cookie expiration
        });
         return res.json({success:true, message: "User registered successfully", user: {name: user.name, email: user.email}});

    } catch (error) {
        return res.json({success:false, message: error.message});
    }
}

// Login a user : /api/user/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({success:false, message: "Email and Password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({success:false, message: "Invalid email or  password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.json({success:false, message: "Invalid email or  password" });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "30d"});
        res.cookie("token", token, {
            httpOnly: true, // Prevent Javascript to access cookie
            secure: process.env.NODE_ENV === "production", // Use secure cookie in production
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict', // SameSite attribute for CSRF protection
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days cookie expiration
        });
        return res.json({success:true, message: "User logged in successfully", user: {name: user.name, email: user.email}});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}

// Check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        const  userId  = req.userId;
        const user = await User.findById(userId).select("-password");
        return res.json({success:true, user});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
        
    }
}

// Logout User : /api/user/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
            maxAge: 0,
        });
        return res.json({success:true, message: "User logged out successfully"});
    } catch (error) {
        console.log(error.message);
        return res.json({success:false, message: error.message});
    }
}