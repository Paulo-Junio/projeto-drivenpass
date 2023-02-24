import { Router } from "express";
import { singIpPost, singUpPost } from "../controllers/user-controllers.js";
import { userValidation } from "../middlewares/autentication-middleware.js";

const usersRouter = Router();

usersRouter.post("/sign-up",userValidation, singUpPost);
usersRouter.post("/sign-in",userValidation, singIpPost)

export { usersRouter };