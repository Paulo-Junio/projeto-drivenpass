import { Network } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { wifiSchema } from "../models/wifi-models.js";

export type wifiInput = Omit<Network, "id" | "userId">

export async function wifiValidation(req: Request, res: Response, next: NextFunction){
    const wifi = req.body as wifiInput;

    const {error} = wifiSchema.validate(wifi);
    if (error){
        
        return res.status(400).send(error.message);
    }

    next()
}