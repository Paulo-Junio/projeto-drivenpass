import { wifiInput } from "../middlewares/wifi-middleware.js";
import userRepository from "../repository/user-repository.js";
import wifiRepository from "../repository/wifi-repository.js";

import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.JWT_SECRET);

async function getWifi(userId: number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    const wifiList = await wifiRepository.getWifi(userId)

    const newWifiList = wifiList.map((wifi) => {
        return {...wifi, password: cryptr.decrypt(wifi.password)}
    } )
    return newWifiList;
}

async function getWifiById(userId: number, id:number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    const wifiExist = await wifiRepository.findWifiById(id)
    if(!wifiExist){
        throw Error("wifi doesn't exist")
    }

    if(wifiExist.userId != userId){
        throw Error("unthorized")
    }

    const newWifi = {...wifiExist, password: cryptr.decrypt(wifiExist.password)}

    return newWifi;
}

async function postWifi(wifi: wifiInput, userId: number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    if(userId != userExist.id){
        throw Error("bad request")
    }

    const newWifi = {...wifi, password: cryptr.encrypt(wifi.password) }
    return wifiRepository.createWifi(newWifi);

}

async function deleteWifiById(userId: number, id:number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    const wifiExist = await wifiRepository.findWifiById(id)
    if(!wifiExist){
        throw Error("wifi doesn't exist")
    }

    if(wifiExist.userId != userId){
        throw Error("unthorized")
    }

    return wifiRepository.deleteWifi(id);
}

const wifiService= {
    getWifi,
    postWifi,
    getWifiById,
    deleteWifiById
};

export default wifiService;