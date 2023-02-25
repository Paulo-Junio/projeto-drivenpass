import express, { json, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { usersRouter } from "./routes/user-routes.js";
import { credentialRouter } from "./routes/credentials-routes.js";
import { wifiRouter } from "./routes/wifi-routes.js";
import { connectDb } from "./database/db.js";

const app = express();

dotenv.config();

app.use(json());
app.use(cors());

app.get("/health", (req: Request, res: Response) => res.send("I'am alive!"));
app.use(usersRouter);
app.use(credentialRouter);
app.use(wifiRouter)

export function init() {
    connectDb();
    return Promise.resolve(app);
}


export default app;