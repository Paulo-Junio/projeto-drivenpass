import credentialsService from "../services/credentials-service.js";



export async function getCredential(req, res) {
    const userId = Number(req.userId);

    try{
        const credentialUserList = await credentialsService.getCredentials(userId)

        return res.status(200).send(credentialUserList)

    } catch(error){

        if (error.message === "user doesn't exist") {
            return res.status(400).send(error.message);
          }
        console.log(error)
        return res.sendStatus(500)
    }
}

export async function getCredentialsById(req, res) {
    const userId = Number(req.userId);
    const id = Number(req.params.id)

    try{
        const wifi = await credentialsService.getCredentialsiById(userId, id)

        return res.status(200).send(wifi)

    } catch(error){

        if (error.message === "user doesn't exist") {
            return res.status(400).send(error.message);
        }

        if (error.message === "unthorized") {
            return res.status(401).send(error.message);
        }

        if (error.message === "credentials doesn't exist") {
            return res.status(400).send(error.message);
        }
          
        console.log(error)
        return res.sendStatus(500)
    }
}

export async function postCredential(req, res) {
    const credentials = req.body;
    const userId = Number(req.userId);
    try{
        const wifiCreated= await credentialsService.postCredentials(credentials, userId)

        return res.status(200).send(wifiCreated)

    } catch(error){

        if (error.message === "user doesn't exist") {
            return res.status(400).send(error.message);
        }
        if (error.message === "bad request") {
            return res.status(400).send(error.message);
        }
        console.log(error)
        return res.sendStatus(500)
    }
}

export async function deleteCredentialById(req, res) {
    const userId = Number(req.userId);
    const id = Number(req.params.id)

    try{
        await credentialsService.deleteCredentialsiById(userId, id)

        return res.sendStatus(200)

    } catch(error){

        if (error.message === "user doesn't exist") {
            return res.status(400).send(error.message);
        }

        if (error.message === "unthorized") {
            return res.status(401).send(error.message);
        }
          
        console.log(error)
        return res.sendStatus(500)
    }
}