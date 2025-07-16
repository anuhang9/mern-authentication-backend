import { Router } from "express";
import { emailVerify, signUp } from "../../controllers/auth.controller";

const authRoute = Router();

authRoute.post('/signup', signUp)

authRoute.post('/email-verify', emailVerify)

export default authRoute;