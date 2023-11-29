import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";
import config from "config";
import { log } from "./logger";
import util from "util";

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();

//     console.log({ creds });
// }
// createTestCreds();

const smtp = config.get<{
    user: string,
    pass: string,
    host: string,
    port: number,
    secure: boolean
}>("smtp");

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: { user: smtp.user, pass: smtp.pass }
})

const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter);


// Define a type for the response
async function sendEmail(payload: SendMailOptions): Promise<string | null> {
    try {
        const info: SentMessageInfo = await sendMailAsync(payload);
        let preview = nodemailer.getTestMessageUrl(info);
        if(!preview){
            preview = '';
        }
        log.info(`Preview URL: ${preview}`);
        return preview ;
    } catch (err: any) {
        log.error(err.message, 'Error sending email');
        return null;
    }
}

export default sendEmail;

