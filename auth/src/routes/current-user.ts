import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ConfigurationError } from "../errors/configuration-error";

const router = express.Router();

router.get("/api/users/currentuser", (req:Request, res: Response) => {
    res.status(200).send({currentUser:req.currentUser});
});

export {router as currentUserRouter}
