import express, { Request, Response } from "express";
import jwt from "jsonwebtoken"
import "express-async-errors";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "@ticketing/common";
import { User } from "../models/user";
import { validateRequest } from "@ticketing/common";

const router = express.Router();

router.post("/api/users/signup", [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body("password")
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters")
],
validateRequest,
async (req:Request, res:Response) => {

    const {email, password} = req.body;

    const existingEmail = await User.exists({email});
    if (existingEmail){
        throw new RequestValidationError([{
            location: "body", 
            value: email, 
            param: "email", 
            msg: "Email in use"}]);
    } 

    const user = User.build({email, password});
    await user.save();

    //genereate JWT
    const userJwt = jwt.sign({id: user.id, email: user.email}, process.env.JWT_KEY!);
    //store on session
    req.session = {
        jwt: userJwt
    };

    res.status(201).send(user);
});

export { router as signupRouter };
