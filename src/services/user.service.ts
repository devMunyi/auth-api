import UserModel, { User } from "../models/user.model"


export async function createUser(input: Partial<User>) {
    return await UserModel.create(input);
}


export async function findUserById(id:string) {
    return await UserModel.findById(id);
}


export async function findUserByEmail(email:string) {
    return await UserModel.findOne({ email })
}

