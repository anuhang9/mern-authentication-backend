import { Request, Response } from "express";
import bcrypt from 'bcryptjs'
import { User } from "../model/auth.model";
import { sendMail } from "../lib/nodemailer.config";
import { VERIFICATION_EMAIL_TEMPLATE } from "../lib/verification-templete";

export const signUp = async(req: Request, res: Response)=>{

    try{
        const {userName, fullName, email, password} = req.body;
        
        if(!userName || !fullName || !email || !password){
            throw new Error("Required all fields.");
        }
        
        const existedUserName = await User.findOne({userName});
        if(existedUserName){
            return res.status(401).json({success: false, message: "Username already exist."});
            // return;
        }
        
        const existedEmail = await User.findOne({email});
        if(existedEmail){
            return res.status(401).json({success: false, message: "Email already exist."});
            // return;
        }
        const verificationToken = Math.floor((10000 * Math.random()) + 10000);
        const hashPassword = await bcrypt.hash(password, 10);
        
        const user = new User({
            userName: userName.toString(), fullName, email, password: hashPassword, verificationToken, verificationTokenExpiresAt: Date.now() + (1000*60*15)
        });
        await user.save();
        
        //json web token
        await sendMail({
            to: email,
            subject: "Verification Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", `${verificationToken}`)
        });
    }catch(error){
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
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "Some unknown error occured in email verify page."});
        }
    }
}