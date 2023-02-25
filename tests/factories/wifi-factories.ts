import { prisma } from "../../src/database/db.js";



export async function createWifi(wifi, userId : number) {

    const wifiCreated = await prisma.network.create({
        data: {...wifi, userId}
    })

    return wifiCreated.id
}
