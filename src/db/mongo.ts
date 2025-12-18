import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

let client: MongoClient;
let dB: Db;
const dbName = "coleccion1";

export const connectToMongoDB = async () => {
    try{
        const mongoUrl = "mongodb+srv://tomas123:oshawott@cluster0.ddttlap.mongodb.net/?appName=Cluster0";
        if(mongoUrl){
            client = new MongoClient(mongoUrl);
            await client.connect();
            dB = client.db(dbName);
            console.log("Mongo conectado");
        } else {
            throw new Error("MONGO_URL is not defined in environment variables");
        }
    }
    catch(err){
        console.log("Mongo no conectado: ", err)
    }
};

export const getDB = ():Db => dB;