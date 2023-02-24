import { NextFunction, Request, Response } from "express";
import { credentialSchema } from "../models/credentials-models.js";



export async function credentialsValidation(req: Request, res: Response, next: NextFunction){
    const credential = req.body;

    const {error} = credentialSchema.validate(credential);
    if (error){
        console.log("foi aqui")
        return res.status(400).send(error.message);
    }

    next()
}