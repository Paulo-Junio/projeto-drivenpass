import { wifiInput } from "../middlewares/wifi-middleware.js";
import wifiService from "../services/wifi-service.js";


export async function getWifi(req, res) {
    const userId = Number(req.userId);
    

    try{
        const wifiUserList = await wifiService.getWifi(userId)

        return res.status(200).send(wifiUserList)

    } catch(error){

        if (error.message === "wifi doesn't exist") {
            return res.status(400).send(error.message);
          }
        
        return res.sendStatus(500)
    }
}

export async function getWifiById(req, res) {
    const userId = Number(req.userId);
    const id = Number(req.params.id)

    try{
        const wifi = await wifiService.getWifiById(userId, id)

        return res.status(200).send(wifi)

    } catch(error){

        if (error.message === "wifi doesn't exist") {
            return res.status(400).send(error.message);
        }

        if (error.message === "unthorized") {
            return res.status(401).send(error.message);
        }
          
        
        return res.sendStatus(500)
    }
}

export async function postWifi(req, res) {
    const wifi = req.body as wifiInput;
    const userId = Number(req.userId);
    try{
        const wifiCreated= await wifiService.postWifi(wifi, userId)

        return res.status(200).send(wifiCreated)

    } catch(error){

        if (error.message === "wifi doesn't exist") {
            return res.status(400).send(error.message);
        }
        if (error.message === "bad request") {
            return res.status(400).send(error.message);
        }
        
        return res.sendStatus(500)
    }
}

export async function deleteWifiById(req, res) {
    const userId = Number(req.userId);
    const id = Number(req.params.id)

    try{
        await wifiService.deleteWifiById(userId, id)

        return res.sendStatus(200)

    } catch(error){

        if (error.message === "wifi doesn't exist") {
            return res.status(400).send(error.message);
        }

        if (error.message === "unthorized") {
            return res.status(401).send(error.message);
        }
          
       
        return res.sendStatus(500)
    }
}

