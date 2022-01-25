import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConfigurationError } from "../errors/configuration-error";

interface UserPayload{
    id: string,
    email:string,
}

declare global {
    namespace Express{
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const setCurrentUser = (req:Request, res:Response, next:NextFunction) => {
    if(req.session?.jwt){
        const jwtUser = req.session.jwt;
        try{
            const payload  = jwt.verify(jwtUser, process.env.JWT_KEY!) as UserPayload;
            req.currentUser = payload;
        }catch(err){
            throw new ConfigurationError([{key: "JWT_KEY", message: "Invalid key"}]);
        }
    }
    next();
}