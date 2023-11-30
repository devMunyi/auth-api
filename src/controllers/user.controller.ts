import { Request, Response } from "express"
import { CreateUserInput, VerifyUserInput } from "../schema/user.schema"
import { createUser, findUserByEmail, findUserById } from "../services/user.service";
import sendEmail from "../utils/mailer";
import { log } from "../utils/logger";
import { nanoid } from "nanoid";
import { smtp } from "../utils/smtp";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput>, res: Response) {
    const body = req.body;
    try {
        const user = await createUser(body);

        const preview = await sendEmail({
            from: "test@example.com",
            to: user.email,
            subject: 'Please Verify Your Account',
            text: `verification code ${user.verificationCode}. Id: ${user._id}`
        });

        return res.status(201).json({ user, preview })
    } catch (e: any) {
        if (e.code === 11000) {
            return res.status(409).send("Email already exists!")
        }
        return res.status(500).json(e.message)
    }
}


export async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {

    const userId = req.params.id;
    const verificationCode = req.params.verificationCode;


    try {
        // check if user exists
        const user = await findUserById(userId);

        if (!user) {
            return res.status(400).json("Could not verify the user!");
        }

        // check if already verified
        if (user.verified) {
            return res.status(409).json("User already verified!")
        }

        // check if verificationCode matches
        if (user.verificationCode === verificationCode) {
            user.verified = true;
            user.save();

            return res.status(200).json("User verified successfully!")
        }

        return res.status(400).json("Could not verify user!")

    } catch (e: any) {
        return res.status(500).json(e.message)
    }

}


export async function forgotPasswordHandler(req: Request, res: Response) {
    const { email } = req.body;
    const message = "If a user is registered with that email you will receive a password reset email;"
    const passwordResetCode = nanoid();

    try {

        // check if user exists
        const user = await findUserByEmail(email);
        
        if(!user){
            return res.status(200).json(message);
        }   
        
        // check if user is not verified
        if(!user.verified){
            log.debug(`User with email ${email} does not exists!`);
            return res.status(200).json("User not verified");
        }

        // set user password reset code
        user.passwordResetCode = passwordResetCode;
        await user.save(); // persist it in the database

        const sendEmailResp = await sendEmail({
            from: `"${smtp.appName}" <${smtp.user}>`,
            to: email,
            subject: 'Forgot Password Request',
            text: `Password reset code ${user.passwordResetCode}. Id: ${user._id}`
        })
        
        if(sendEmailResp){
            return res.status(200).json(message); 
        }

        return res.status(400).json("Password reset failed! Please try again.")

    } catch (e: any) {
        return res.status(500).json(e.message)
    }
}