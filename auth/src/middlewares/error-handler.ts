import { NextFunction, Request, Response } from "express";
import { SerializableError } from "../errors/serializable-error";

export const errorHandler = (err: Error, req:Request, res: Response, next: NextFunction) => {
    console.log(`An error of type ${err.constructor.name} is detected`);
    if(err instanceof SerializableError){
        return res.status(err.statusCode).send(err.serializaleError());    
    }

    res.status(500).send({ errors: [{message: err.message}] });
};
