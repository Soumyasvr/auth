import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { transporter } from "../config/nodeMailer.js";


export const register = async (req,res) =>{
    const {name, email, password} = req.body;

    if (!name || !email || !password){
        return res.json({success: false, message:"All fields are required"})
    }

    try {

        const existingUser = await userModel.findOne({email});

        if(existingUser){
            return res.json({success: false, message:"User already exists"})
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = new userModel({name, email, password: hashedPassword});
        await user.save();

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.cookie("token", token , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        //sending welcome mail

        const mailOptions = {
            from: process.env.SMTP_SENDER,
            to: email,
            subject: "Welcome to Our Service",
            text: `Hello ${name},\n\nThank you for registering! Your account has been created successfully.\n\nBest regards,\nThe Team`
        }

        await transporter.sendMail(mailOptions);

        res.json({success: true, message: "User registered successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const login = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.json({success: false, message: "All fields are required"})
    }
    try {
      const user = await userModel.findOne({email});

      if(!user){
        return res.json({success:false, message: "User not found"});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if(!isMatch){
        return res.json({success: false, message: "Invalid credentials"});
      }

      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.cookie("token", token , {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.json({success: true, message: "User logged in successfully"})

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}

export const logout = async (req,res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })

        return res.json({success: true, message: "User Logged Out Successfully"});
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}
 
export const sendVerifyOTP = async (req, res) => {
    try {

        const {userId} = req.body;

        const user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"})
        }

        // Generate OTP

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.verifyOtp = otp;
        user.verifyOtpExpaireAt = Date.now() + 24 * 60 * 60 * 1000;

        await user.save();

        // send otp to mail

        const sendOtpToMail ={
            from: process.env.SMTP_SENDER,
            to: user.email,
            subject: "Verify Your Account",
            text: `Your OTP is ${otp}. It is valid for 24 hours.`,
        }
        await transporter.sendMail(sendOtpToMail)

        return res.json({success: true, message: "OTP sent to your email"})
        
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

export const verifyAccount = async (req, res) => {
    const {userId, otp} = req.body;

    if(!userId || !otp){
        return res.json({success: false, message: "All fields are required"})
    }

    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.json({success:false, message: "User not found"})
        }

        if(user.verifyOtp === "" || user.verifyOtp !== otp){
            return res.json({success: false, message: "Inavalid OTP"})
        }

        if (user.verifyOtpExpaireAt < Date.now()){
            return res.json({success: false, message: "OTP expaired"})
        }

        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpaireAt = 0;

        await user.save();

        

        return res.json({success: true, message: "Account verified successfully"});

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//checking user is authenticated or not

export const isAuthenticated = async (req,res) => {
    try {

        return res.json({success:false, message:"User Authenticated Successfully"})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

//send reset OTP

export const sendResetOtp = async (req, res) =>{
    const {email} = req.body;

    if(!email){
        return res.json({success: false, message: "Email is required"})
    }
    try {

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false, message: "User not Found"})
        }

        // Generate OTP

        const otp = String(Math.floor(100000 + Math.random() * 900000))

        user.resetOtp = otp;
        user.resetOtpExpaireAt = Date.now() + 10 * 60 * 1000 // 10 minutes

        await user.save();

        // send otp to mail

        const sendOtpToMail = {
            from: process.env.SMTP_SENDER,
            to: user.email,
            subject: "Reset Your Password",
            text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
        }

        await transporter.sendMail(sendOtpToMail);

        return res.json({success: true, message: "OTP sent to your email"});
        
    } catch (error) {
        res.json({success:false, message: error.message})
    }
}


// Reset password

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;

    if(!email || !otp || !newPassword){
        return res.json({success: false, message: "All fields are required"});
    }

    try {

        const user = await userModel.findOne({email});

        if(!user){
            return res.json({success: false, message: "User not found"});
        }

        if(user.resetOtp === "" || user.resetOtp !== otp){
            return res.json({success: false, message:"Invalid OTP"})
        }

        // check opt expaired or not

        if(user.resetOtpExpaireAt < Date.now()){
            return res.json({success:false, message: "OTP expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10)

        user.password = hashedPassword;
        user.reserOtp="";
        user.resetOtpExpaireAt = 0;

        await user.save();

        return res.json({success:true, message: "Password reset successfully"});

    } catch (error) {
        res.json({success:false, message: error.message})
    }
}