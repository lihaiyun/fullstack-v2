import express from "express";
import yup from "yup";
import bcrypt from "bcrypt";

import User from "../models/user.js";

const router = express.Router();

const userSchema = yup.object().shape({
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
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, 'Password must be at least 8 characters long and contain at least one letter and one number')
        .max(50, 'Password must be at most 50 characters')
    });

router.post("/register", async (req, res) => {
    let data = req.body;
    try {
        data = await userSchema.validate(data, { abortEarly: false });
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

export default router;