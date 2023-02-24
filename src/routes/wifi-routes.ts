import { Router } from "express";
import { getWifi, getWifiById, postWifi, deleteWifiById } from "../controllers/wifi-controllers.js";
import { verifyJWT } from "../middlewares/autentication-middleware.js";
import { wifiValidation } from "../middlewares/wifi-middleware.js";
const wifiRouter = Router();


wifiRouter.get("/wifi",verifyJWT, getWifi );
wifiRouter.get("/wifi/:id",verifyJWT, getWifiById );
wifiRouter.post("/wifi",verifyJWT, wifiValidation, postWifi);
wifiRouter.delete("/wifi/:id",verifyJWT, deleteWifiById );

export { wifiRouter };