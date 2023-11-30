import nodemailer, { SendMailOptions, SentMessageInfo } from "nodemailer";
import { log } from "./logger";
import util from "util";
import { smtp } from "./smtp";

// const transporter = nodemailer.createTransport({
//     ...smtp,
//     auth: { user: smtp.user, pass: smtp.pass }
// })

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

const sendMailAsync = util.promisify(transporter.sendMail).bind(transporter);


// Define a type for the response
async function sendEmail(payload: SendMailOptions): Promise<string | null> {
    try {
        const info: SentMessageInfo = await sendMailAsync(payload);
        // let preview = nodemailer.getTestMessageUrl(info);
        if(!info){
             return null;
        }
        return info ;
    } catch (err: any) {
        log.error(err.message, 'Error sending email');
        return null;
    }
}

export default sendEmail;

