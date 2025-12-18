import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { p1} from "../utils";
import { ObjectId } from "mongodb";


export const startJourney = async (name: string, password: string) => {
    const db = getDB();
    const encriptacion = await bcrypt.hash(password, 10);

    const result = await db.collection(p1).insertOne({
        name,
        password: encriptacion,
        clothes: []
    });

    return result.insertedId.toString();
};

export const login = async (name: string, password:string)=>{
    const db=getDB();
    const user = await db.collection(p1).findOne({name});
    if(!user) return null;
    const passComparada = await bcrypt.compare(password,user.password);
    if(!passComparada)throw new Error("Constraseña mal");
    return user;
}

