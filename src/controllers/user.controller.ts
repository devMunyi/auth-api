import { Request, Response } from "express"
import { CreateUserInput } from "../schema/user.schema"
import { createUser } from "../services/user.service";

const createUserHandler = async(req: Request<{}, {}, CreateUserInput>, res:Response) => {
    const body = req.body;
    try {
        const user = await createUser(body);
        return res.status(201).json(user)
    } catch (e: any) {
        if(e.code === 11000){
            return res.status(409).send("Email already exists!")
        }
        return res.status(500).json(e.message)
    }
}

export default createUserHandler;