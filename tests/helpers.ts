import { faker } from "@faker-js/faker";
import { prisma } from "../src/database/db.js";
import jwt from "jsonwebtoken";
import { createUser } from "./factories/user-factories";


export async function cleanDb() {
  await prisma.credential.deleteMany({});
  await prisma.network.deleteMany({});
  await prisma.user.deleteMany({});
};

export async function generateValidToken(user) {

  const token:string = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  return token;
}