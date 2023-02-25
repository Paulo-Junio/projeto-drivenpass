import bcrypt from "bcrypt";
import { prisma } from "../../src/database/db.js";




export async function createUser(user) {

    const hashedPassword = await bcrypt.hash(user.password, 10);

    const userCreated = await  prisma.user.create({
        data: {
            email: user.email,
            password: hashedPassword
        }
    })

    return { ...userCreated, password : user.password };
}
