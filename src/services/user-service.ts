import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import userRepository from "../repository/user-repository.js";
import jwt from "jsonwebtoken";

export type userInput = Omit<User, "id">

async function signInUser({ email, password}: userInput): Promise<string> {

    const emailExist = await userRepository.findEmail(email);
    if(!emailExist){
        throw Error("user not exist")
    }
    const validatePassword = bcrypt.compareSync(password, emailExist.password);

     if (validatePassword){
        const token = jwt.sign({userId: emailExist.id}, process.env.JWT_SECRET, {expiresIn: 300})
        return token;
    } else{
        throw Error("incorrect passowrd")
    }
       
}

async function signUpUser({ email, password }: userInput): Promise<User> {

    const emailExist = await userRepository.findEmail(email);

    if(emailExist){
        throw Error("email already exist")
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
    return userRepository.createUser({
      email,
      password: hashedPassword,
    });
}

const userService = {
    signInUser,
    signUpUser
}
export default userService;