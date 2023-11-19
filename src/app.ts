require("dotenv").config();
import express from "express";
import config from "config";
import { log } from "./utils/logger";
import connectToDb from "./utils/connectToDb";
import router from "./routes";
import morgan from "morgan";


const app = express();

app.use(express.json())
app.use(morgan("dev"));
app.use(router)

const port = config.get<Number>("port");


app.listen(port, () => {
    log.info(`App started at: http://localhost:${port}`)
    connectToDb();
});