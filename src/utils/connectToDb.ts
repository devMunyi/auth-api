import mongoose from "mongoose";
import config from "config";
import { log } from "./logger";


export default async function connectToDb(){
    const dbURI = config.get<string>("cloudDbURI");
    try{
        await mongoose.connect(dbURI);
        log.info("Conneted to DB!");
    }catch(e: any){
        log.error("Could not Connect to DB!")
        process.exit(1);
    }
}