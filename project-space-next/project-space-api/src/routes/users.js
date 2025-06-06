import express from "express";
import yup from "yup";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";
import { validateToken } from "../middlewares/auth.js";

const router = express.Router();
const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "None" : "Lax"
};

const registerSchema = yup.object().shape({
    name: yup.string().trim()
        .required('Name is required')  
        .matches(/^[a-zA-Z '-,.]+$/, 'Name must only contain letters, spaces and characters: \'-,.')
        .max(100, 'Name must be at most 100 characters'),
    email: yup.string().trim()
        .required('Email is required')
        .email('Email must be a valid email address')
        .max(100, 'Email must be at most 100 characters'),
    password: yup.string().trim()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, 'Password must contain at least one letter and one number')
        .max(50, 'Password must be at most 50 characters')
});

const loginSchema = yup.object().shape({
    email: yup.string().trim()
        .required('Email is required')
        .email('Email must be a valid email address')
        .max(100, 'Email must be at most 100 characters'),
    password: yup.string().trim()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).*$/, 'Password must contain at least one letter and one number')
        .max(50, 'Password must be at most 50 characters')
});

router.post("/register", async (req, res) => {
    let data = req.body;
    try {
        data = await registerSchema.validate(data, { abortEarly: false });
        //console.log(data);
    } catch (err) {
        return res.status(400).json({ message: err.errors.join(", ") });
    }

    // Check if the email is already in use
    const { name, email, password } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ message: "Email is already in use" });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
        name,
        email,
        password: hashedPassword
    });

    try {
        const savedUser = await newUser.save();
        res.json(savedUser);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to register user" });
    }
});

router.post("/login", async (req, res) => {
    let data = req.body;
    try {
        data = await loginSchema.validate(data, { abortEarly: false });
        //console.log(data);
    } catch (err) {
        return res.status(400).json({ message: err.errors.join(", ") });
    }

    // Check if the email and password match
    const { email, password } = data;
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const userInfo = {
        _id: user._id,
        name: user.name,
        email: user.email
    };
    const accessToken = jwt.sign(userInfo, process.env.APP_SECRET, 
        { expiresIn: process.env.TOKEN_EXPIRES_IN });
    // return access token in cookie, allowing cross-site cookies
    res.cookie("accessToken", accessToken, cookieOptions);
    res.json({ user: userInfo });
});

router.get("/auth", validateToken, async (req, res) => {
    res.json({user: req.user});
});

router.post("/logout", (req, res) => {
    // Clear the access token cookie
    res.clearCookie("accessToken", cookieOptions);
    res.json({ message: "Logged out successfully" });
});

export default router;