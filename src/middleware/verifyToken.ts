import { NextFunction, Request, Response } from "express";
import Jwt from "jsonwebtoken";
import { AuthRequest } from "../interfaces/interfaceColletion";

export const verifyToken =(req: AuthRequest, res: Response, next: NextFunction)=>{
    const token = req.cookies["mern-auth-token"];
    if(!token){
        return res.status(400).json({success: false, message: "Unauthorized device."});
    }
    try{
        const jwt_secret = process.env.JWT_SECRET;
        if(!jwt_secret){
            return res.status(400).json({success: false, message: "jwt secret key is not avilabel env file."});
        }
        const decode = Jwt.verify(token, jwt_secret) as {userId: string};
        req.userId = decode.userId;
        next()
    }catch(error){
        if(error instanceof Error){
            res.status(400).json({success: false, message: error.message});
        }
        else{
            res.status(400).json({success: false, message: "Some error occured in checking authentication."});
        }
    }
}