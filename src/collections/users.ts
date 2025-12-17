import { getDB } from "../db/mongo";
import bcrypt from "bcryptjs";
import { prueba1 } from "../utils";
import { ObjectId } from "mongodb";


export const createUser = async (email: string, password: string) => {
    const db = getDB();
    const toEncriptao = await bcrypt.hash(password, 10);

    const result = await db.collection(prueba1).insertOne({
        email,
        password: toEncriptao,
        clothes: []
    });

    return result.insertedId.toString();
};

export const validateUser = async (email: string, password:string)=>{
    const db=getDB();
    const user = await db.collection(prueba1).findOne({email});
    if(!user) return null;
    const passComparada = await bcrypt.compare(password,user.password);
    if(!passComparada)throw new Error("Constraseña mal");
    return user;
}
