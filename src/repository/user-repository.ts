import prisma from "../database/db.js";
import { userInput } from "../services/user-service.js";


async function findEmail(email: string){
  return prisma.user.findFirst({
    where: {email}
  })
}
  
async function createUser(data:userInput) {
  return prisma.user.create({
    data,
  });
}

async function getUser(userId: number){
  return prisma.user.findFirst({
    where: {id: userId}
  })
}
  
  const userRepository = {
    findEmail,
    createUser,
    getUser
  };
  
  export default userRepository;