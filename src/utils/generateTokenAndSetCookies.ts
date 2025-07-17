import { Response } from 'express';
import {sign} from 'jsonwebtoken';

export const generateTokenAndSetCookie =async(res: Response, userId: string) =>{

    const jwt_secret = process.env.JWT_SECRET;
    if(!jwt_secret){
        return res.status(400).json({success: false, message: "jwt secret is not avilable in env file"});
    }

    const token = sign({userId}, jwt_secret, {expiresIn: "15m"});
    res.cookie("mern-auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000*60*15
    });
    return token;
}