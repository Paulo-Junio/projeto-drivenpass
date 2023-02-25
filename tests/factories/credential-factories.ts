import { prisma } from "../../src/database/db.js";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";


const cryptr = new Cryptr(process.env.JWT_SECRET);

export async function createCredential(credential, userId : number) {
    const newCredential = {...credential, userId,password: cryptr.encrypt(credential.password) }
    const credentialCreated = await prisma.credential.create({
        data: newCredential
    })

    return credentialCreated.id
}
