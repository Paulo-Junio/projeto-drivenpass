import { prisma } from "../../src/database/db.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.JWT_SECRET);


export async function createWifi(wifi, userId : number) {

    const newWifi = {...wifi, userId ,password: cryptr.encrypt(wifi.password) }
    const wifiCreated = await prisma.network.create({
        data : newWifi
    })

    return wifiCreated.id
}
