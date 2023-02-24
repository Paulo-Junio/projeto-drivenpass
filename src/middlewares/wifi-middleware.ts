import { Network } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { wifiSchema } from "../models/wifi-models.js";

export type wifiInput = Omit<Network, "id">

export async function wifiValidation(req: Request, res: Response, next: NextFunction){
    const wifi = req.body as wifiInput;

    const {error} = wifiSchema.validate(wifi);
    if (error){
        console.log("foi aqui")
        return res.status(400).send(error.message);
    }

    next()
}