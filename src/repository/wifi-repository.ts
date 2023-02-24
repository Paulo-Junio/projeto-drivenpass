import prisma from "../database/db.js";
import { wifiInput } from "../middlewares/wifi-middleware.js";



async function findWifiById(id:number){
  return prisma.network.findFirst({
    where: {id}
  })
}

async function getWifi(userId: number){
    return prisma.network.findMany({
        where: {userId}
    })
}

async function createWifi(wifi: wifiInput) {
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
    findWifiById,
    getWifi,
    createWifi,
    deleteWifi
};

export default wifiRepository;