import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

// ------------------ REGISTER ------------------
const register = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ message: "Enter all fields!" });
        }

        // Check if username already exists
        const existing = await User.findOne({ username: username.toLowerCase() });
        if (existing) {
            return res.status(409).json({ message: "User already exists!" });
        }

        // Hash password


        // Create new user
        const user = await User.create({
            username: username.toLowerCase(),
            password: password,
        });

        return res.status(201).json({
            message: "User registered successfully!",
            user: { id: user._id, username: user.username }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error!" });
    }
};



// ------------------ LOGIN ------------------
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            return res.status(400).json({ message: "Enter all fields!!" });
        }

        // Check existing user
        const existing = await User.findOne({ username: username.toLowerCase() });
        if (!existing) {
            return res.status(404).json({ message: "User not found!" });
        }

        // Compare password
        const isMatch = (password==existing.password);
        if(!isMatch) {
            return res.status(401).json({ message: "Invalid password!" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: { id: existing._id, username: existing.username }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error!!" });
    }
};



//Logout

const logout = async(req,res) =>{
    try {
        const {username}= req.body;

        const user = await User.findOne({username: username       });

        if(!user){
            return res.status(404).json({message: "User not found!"});
        }

        res.status(200).json({message:"Logout success!"})
    } catch (error) {
        res.status(500).json({message: " Internal server error "})
    }
}
export { register, login,logout };
