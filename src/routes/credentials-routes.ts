import { Router } from "express";
import { deleteCredentialById, getCredential, getCredentialsById, postCredential } from "../controllers/credentials-controllers.js";
import { verifyJWT } from "../middlewares/autentication-middleware.js";
import { credentialsValidation } from "../middlewares/credentials-middleware.js";
const credentialRouter = Router();


credentialRouter.get("/credential",verifyJWT, getCredential );
credentialRouter.get("/credential/:id",verifyJWT, getCredentialsById );
credentialRouter.post("/credential",verifyJWT, credentialsValidation, postCredential);
credentialRouter.delete("/credential/:id",verifyJWT, deleteCredentialById );

export { credentialRouter };