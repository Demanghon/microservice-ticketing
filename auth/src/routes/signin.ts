import express, { Request, Response } from "express";
import {body} from "express-validator"
import jwt from "jsonwebtoken";
import { SigninError } from "@ticketing/common";
import { validateRequest } from "@ticketing/common";
import { User } from "../models/user";
import { Password } from "../services/password";

const router = express.Router();

router.post("/api/users/signin", [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body("password")
        .notEmpty()
        .withMessage("Password must be supply")
],
validateRequest, 
async (req: Request, res:Response) => {
    const {email, password} = req.body;

    const existingUser = await User.findOne({email});
    if (!existingUser || !(await Password.areEquals(existingUser.password, password))){
        throw new SigninError();
    } 

    //genereate JWT
    const userJwt = jwt.sign({id: existingUser.id, email: existingUser.email}, process.env.JWT_KEY!);
    //store on session
    req.session = {
        jwt: userJwt
    };

    res.status(200).send(existingUser);

});

export { router as signinRouter };
