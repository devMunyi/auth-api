import { DocumentType, Severity, getModelForClass, modelOptions, pre, prop } from "@typegoose/typegoose";
import argon2 from "argon2";
import { nanoid } from "nanoid";
import { log } from "../utils/logger";


@pre<User>("save", async function() {
    if(!this.isModified('password')){
        return
    }

    const hash = await argon2.hash(this.password);
    this.password = hash;
    return;
})

@modelOptions({
    schemaOptions: {
        timestamps: true // auto creates createdAt and updatedAt fields
    },
    options: {
        allowMixed: Severity.ALLOW // will us store string or null for password reset field
    }
})

export class User {
    @prop({ lowercase: true, required: true, unique: true })
    email: string

    @prop({ required: true })
    firstName: string

    @prop({ required: true })
    lastName: string

    @prop({ required: true })
    password: string

    @prop({ required: true, default: () => nanoid() })
    verificationCode: string

    @prop()
    passwordResetCode: string | null

    @prop({ default: false })
    verified: boolean

    async validatePassword(this: DocumentType<User>, rawPassword: string){
        try {
            return argon2.verify(this.password, rawPassword);
        } catch (error: any) {
            log.error(error)
            return false;
        }
    }
}


const UserModel = getModelForClass(User);
export default UserModel;
