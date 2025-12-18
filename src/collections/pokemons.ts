import { getDB } from "../db/mongo"
import { p2,p1} from "../utils";
import { ObjectId } from "mongodb";
import {typeDefs} from "../graphql/schema";

export const MuestraPokemons = async (page?: number,size?: number)=>{
    const db = getDB();
    page=page || 1;
    size=size || 10;
    return await db.collection(p2).find().skip((page-1)*size).limit(size).toArray();
}

export const buscapokemonporId = async(id:string)=>{
    const db = getDB();
    return await db.collection(p2).findOne({_id:new ObjectId(id)})
}


export const createPokemon = async (name: string, description: string, height:number ,weight: number, types : string)=>{
    const db = getDB();
    const result = await db.collection(p2).insertOne({
        name,description,height,weight,types
    });
    const newPokemon = await buscapokemonporId(result.insertedId.toString())
    return newPokemon;
}



