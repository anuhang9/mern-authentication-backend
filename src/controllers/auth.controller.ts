import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { User } from "../model/auth.model";
import { sendMail } from "../lib/nodemailer.config";
import { VERIFICATION_EMAIL_TEMPLATE } from "../lib/verification-templete";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies";
import { PASSWORD_RESET_REQUEST_TEMPLATE } from "../lib/password-reset";
import { randomBytes } from "crypto";
import { AuthRequest } from "../interfaces/interfaceColletion";

export const signUp = async(req: Request, res: Response)=>{

    try{
        const {userName, fullName, email, password} = req.body;
        
        if(!userName || !fullName || !email || !password){
            throw new Error("Required all fields.");
        }
        
        const existedUserName = await User.findOne({userName});
        if(existedUserName){
            return res.status(401).json({success: false, message: "Username already exist."});
        }
        
        const existedEmail = await User.findOne({email});
        if(existedEmail){
            return res.status(401).json({success: false, message: "Email already exist."});
        }
        const verificationToken = Math.floor((10000 * Math.random()) + 10000);
        const hashPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            userName: userName.toString(), fullName, email, password: hashPassword, verificationToken, verificationTokenExpiresAt: Date.now() + (1000*60*15)
        });
        await user.save();
        
        //json web token
        generateTokenAndSetCookie(res, user._id.toString())

        //nodemailer
        await sendMail({
            to: email,
            subject: "Verification Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", `${verificationToken}`)
        });
        res.status(200).json({success: true, message: "User create successfull."});
    }catch(error){
        console.log(error)
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "Some unknown error occured in signup page."});
        }
    };
};

export const emailVerify = async(req: Request, res: Response)=>{
    try{
        const { otpCode } = req.body;
        const user = await User.findOne({
            verificationToken: otpCode,
            verificationTokenExpiresAt: {$gt: Date.now()}
        })
        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired token."});
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpiresAt = undefined;
        await user.save();
        res.status(200).json({success: true, message: "Email verify successfull."});
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "Some unknown error occured in email verify page."});
        }
    }
}

export const logout = async(req: Request, res: Response)=>{
    res.clearCookie("mern-auth-token");
    res.status(200).json({success: true, message: "Logout successfull."});
}

export const login = async(req: Request, res: Response)=>{
    try{
        const {userName, password} = req.body;
        if(!userName || !password){
            return res.status(200).json({success: false, message: "Required all fields."});
        }
        const user = await User.findOne({userName});
        if(!user){
            return res.status(400).json({success: false, message: "Incorrect credentials."});
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if(!isValidPassword){
            return res.status(400).json({success: false, message: "Incorrect credentials."});
        }
        generateTokenAndSetCookie(res, user._id.toString());
        user.lastLogin = new Date();
        await user.save()

        res.status(200).json({success: true, message: "Login successfull."})
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.send({success: false, message: "Some unknown error occured in log in page."});
        }
    }
}

export const forgetPassword = async(req: Request, res: Response)=>{
    try{
        const {email} = req.body;
        if(!email){
            return res.status(400).json({success: false, message: "Enter the Email"});
        }

        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({success: false, message: "Email not existed."});
        }

        const resetToken = randomBytes(20).toString("hex");
        // it can retrun error when forgetting password
        const resetTokenExpiresAt = new Date( Date.now() + 1000 * 60 *15);
        user.resetPasswordToken = resetToken;
        user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
        await user.save()

        await sendMail({to: email, subject: "Recover your password", html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", `${process.env.FRONT_END_URL}/forget-password/${resetToken}`)})

        res.status(200).json({success: true, message: "Check your email to recover your password."})
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "Some unknown error occured in forget password page."});
        }
    }
}

export const resetPassword = async(req: Request, res: Response)=>{
    try{
        const{resetPassword} = req.body;
        const {token} = req.params;

        const user = await User.findOne({resetPasswordToken: token, resetPasswordTokenExpiresAt: {$gt: Date.now()}})
        if(!user){
            return res.status(400).json({success: false, message: "Invalid or expired token."});
        }
        const hashPassword = await bcrypt.hash(resetPassword, 10);
        user.password = hashPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpiresAt = undefined;
        await user.save();

        res.status(200).json({success: true, message: "Password reset successfull."});
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "some unknown error occured in reset password page."});
        }
    }
}

export const checkAuth =async(req: AuthRequest, res: Response)=>{
    try{
        const user = await User.findById(req.userId).select("-password");
        if(!user){
            return res.status(400).json({success: false, message: "Unauthorize token."})
        }
        res.status(200).json({user, success: true, message: "Authenticated."})
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "some unknown error occured in auth page."});
        }
    }
}