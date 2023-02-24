import prisma from "../database/db.js";



async function findCredentialsById(id:number){
  return prisma.credential.findFirst({
    where: {id}
  })
}

async function getCredentials(userId: number){
    return prisma.credential.findMany({
        where: {userId}
    })
}

async function createCredentials(credentials) {
    return prisma.credential.create({
      data: credentials
    });
}

async function deleteCredentials(id:number){
    return prisma.credential.delete({
        where: {id}
    })
}

const credentialsRepository = {
    findCredentialsById,
    getCredentials,
    createCredentials,
    deleteCredentials
};

export default credentialsRepository;