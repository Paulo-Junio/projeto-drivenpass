import { faker } from "@faker-js/faker";
import { prisma } from "../src/database/db.js";
import jwt from "jsonwebtoken";
import { createUser } from "./factories/user-factories";


export async function cleanDb() {
  await prisma.credential.deleteMany({});
  await prisma.network.deleteMany({});
  await prisma.user.deleteMany({});
};

export async function generateValidToken() {
  const validBody ={
    email: faker.internet.email(),
    password: faker.internet.password(10)
  }
  
  const user = await createUser(validBody);
  const token:string = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);

  const response = {token, userId: user.userId}
  return response;
}