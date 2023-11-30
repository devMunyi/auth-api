import config from "config";

// async function createTestCreds() {
//     const creds = await nodemailer.createTestAccount();
//     console.log({ creds });
// }
// createTestCreds();
export const smtp = config.get<{
    appName: string;
    user: string;
    pass: string;
    host: string;
    port: number;
    secure: boolean;
}>("smtp");
