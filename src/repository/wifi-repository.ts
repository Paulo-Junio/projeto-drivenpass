import { prisma } from "../database/db.js";

type wifiCreate = {
  password: string;
  title: string;
  network: string;
  userId: number
}

async function getWifiById(id:number){
  return prisma.network.findFirst({
    where: {id}
  })
}

async function getWifi(userId: number){
    return prisma.network.findMany({
        where: {userId}
    })
}

async function createWifi(wifi: wifiCreate) {
    return prisma.network.create({
      data: wifi
    });
}

async function deleteWifi(id:number){
    return prisma.network.delete({
        where: {id}
    })
}

const wifiRepository = {
    getWifiById,
    getWifi,
    createWifi,
    deleteWifi
};

export default wifiRepository;