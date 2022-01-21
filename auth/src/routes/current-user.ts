import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConfigurationError } from "../errors/configuration-error";

const router = express.Router();

router.get("/api/users/currentuser", (req:Request, res: Response) => {
    let currentUser = null;
    if(req.session?.jwt){
        const jwtUser = req.session.jwt;
        try{
            const payload  = jwt.verify(jwtUser, process.env.JWT_KEY!)
            currentUser = payload;
        }catch(err){
            throw new ConfigurationError([{key: "JWT_KEY", message: "Invalid key"}]);
        }
    }

    res.status(200).send({currentUser});


});

export {router as currentUserRouter}
