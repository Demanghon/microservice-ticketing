import express, { Request, Response } from "express";
import "express-async-errors";
import { body, validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";

const router = express.Router();

router.post("/api/users/signup", [
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body("password")
        .isLength({min: 4, max: 20})
        .withMessage("Password must be between 4 and 20 characters")
],async (req:Request, res:Response) => {
    console.log("Request");
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array());
    }

    throw new DatabaseConnectionError("Error connection to the database");

    const {email, password} = req.body;
    res.send({email, password});
});

export { router as signupRouter };
