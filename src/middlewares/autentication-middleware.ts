import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { signInSchema } from "../models/user-models.js";
import { userInput } from "../services/user-service.js";



export function userValidation(req: Request, res: Response, next: NextFunction){
    const user = req.body as userInput;

    const {error} = signInSchema.validate(user);

    if (error){
        
        return res.status(400).send(error.message);
    }

    next()
}


export function verifyJWT(req, res, next){
    const  authorization  = req.headers.authorization;
    

    if(!authorization){
        return res.sendStatus(401);
    } 
    const token = authorization?.replace("Bearer ", "");
  
    if(!token){
        return res.sendStatus(401);
    } 
    
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if(err) {
        
        res.status(401).send(err) 
      }
      
      req.userId = decoded.userId;
    });
  
    next();
 }