import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/interfaceColletion";

export const verifyToken =(req: AuthRequest, res: Response, next: NextFunction)=>{
    const token = req.cookies["mern-auth-token"];
    if(!token){
        return res.status(401).json({success: false, message: "Unauthorized device. Please login."});
    }
    try{
        const jwt_secret = process.env.JWT_SECRET;
        if(!jwt_secret){
            return res.status(500).json({success: false, message: "jwt secret key is not avilable env file."});
        }
        const decode = jwt.verify(token, jwt_secret) as {userId: string};
        req.userId = decode.userId;
        next()
    }catch(error){
        console.log(error)
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "Some error occured in checking authentication."});
        }
    }
}