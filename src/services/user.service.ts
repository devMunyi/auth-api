import UserModel, { User } from "../models/user.model"


export const createUser = async (input: Partial<User>) => {
    return await UserModel.create(input);
}