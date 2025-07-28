import { Router } from "express";
import { checkAuth, emailVerify, forgetPassword, login, logout, resetPassword, signUp } from "../controllers/auth.controller";
import { verifyToken } from "../middleware/verifyToken";

const authRoute = Router();

authRoute.get('/check-auth', verifyToken, checkAuth)

authRoute.post('/signup', signUp);

authRoute.post('/email-verify', emailVerify);

authRoute.post('/logout', logout);

authRoute.post('/login', login);

authRoute.post('/forgot-password', forgetPassword);

authRoute.post('/reset-password/:token', resetPassword);

export default authRoute;