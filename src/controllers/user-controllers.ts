import { Request, Response } from "express";
import userService, { userInput } from "../services/user-service.js";


export async function singUpPost(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    const user = await userService.signUpUser({ email, password });
    return res.status(200).send({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    if (error.message === "email already exist") {
      return res.status(409).send(error.message);
    }
    return res.status(400).send(error);
  }
}


export async function singIpPost(req: Request, res: Response) {
    const { email, password } = req.body as userInput;
  
    try {
      const token: string = await userService.signInUser({ email, password });
      return res.status(200).send({token});

    } catch (error) {
      if (error.message === "user not exist") {
        return res.status(400).send(error.message);
      }

      if (error.message === "incorrect passowrd") {
        return res.status(401).send(error.message);
      }
      return res.status(400).send(error);
    }
  }
