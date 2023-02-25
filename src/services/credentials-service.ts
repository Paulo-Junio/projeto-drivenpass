import credentialsRepository from "../repository/credentials-repository.js";
import userRepository from "../repository/user-repository.js";
import Cryptr from "cryptr";

const cryptr = new Cryptr(process.env.JWT_SECRET);

async function getCredentials(userId: number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    const credintialList = await credentialsRepository.getCredentials(userId)
    const newCredintialList = credintialList.map((credential) => {
        return {...credential, password: cryptr.decrypt(credential.password)}
    } )
    return newCredintialList;
}

async function getCredentialsiById(userId: number, id:number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    const credentialExist = await credentialsRepository.findCredentialsById(id)
    if(!credentialExist){
        throw Error("credentials doesn't exist")
    }

    if(credentialExist.userId != userId){
        throw Error("unthorized")
    }

    const newCredintial = {...credentialExist, password: cryptr.decrypt(credentialExist.password)}

    return newCredintial;
}

async function postCredentials(credentials, userId: number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    if(userId != userExist.id){
        throw Error("bad request")
    }

    const credentialsList = await credentialsRepository.getCredentials(userId);

    const titleExist = credentialsList.map(credentialTitle => credentialTitle.title);

    if(titleExist.includes(credentials.title)){
        throw Error("bad request")
    }

    const newCredential = {...credentials, password: cryptr.encrypt(credentials.password), userId }
    return credentialsRepository.createCredentials(newCredential);
}

async function deleteCredentialsiById(userId: number, id:number) {
    const userExist = await userRepository.getUser(userId);

    if(!userExist){
        throw Error("user doesn't exist")
    }

    const credentialExist = await credentialsRepository.findCredentialsById(id)
    if(!credentialExist){
        throw Error("wifi doesn't exist")
    }

    if(credentialExist.userId != userId){
        throw Error("unthorized")
    }

    await credentialsRepository.deleteCredentials(id);
}

const credentialsService= {
    getCredentials,
    postCredentials,
    getCredentialsiById,
    deleteCredentialsiById
};

export default credentialsService;