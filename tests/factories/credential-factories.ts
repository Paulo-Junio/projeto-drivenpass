import { prisma } from "../../src/database/db.js";




export async function createCredential(credential, userId : number) {

    const credentialCreated = await prisma.credential.create({
        data: {...credential, userId}
    })

    return credentialCreated.id
}
