import { IResolvers } from "@graphql-tools/utils";
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { URLSearchParams } from "node:url";
import {startJourney,login} from "../collections/entrenador";
import {buscapokemonporId,MuestraPokemons,createPokemon} from "../collections/pokemons";

export const resolvers:IResolvers = {
    Query:{
        me:async(_,__,{user}) => {
            if(!user)throw new Error("Logeate");
            return {
                _id:user._id.toString(),
                ...user
            }
        },
        pokemons: async(_,{page,size})=>{
            return await MuestraPokemons(page,size);
        },
        pokemon: async(_,{id})=>{
            return await buscapokemonporId(id);
        }
    },

    User:{
        
    },
    Mutation: {
        startJourney: async (_,{email,password})=>{
            const idEntrenador= await startJourney(email,password);
            return signToken(idEntrenador);
        },
        login: async (_,{email,password})=>{
            const user = await login(email,password);
            if(!user) throw new Error(" Inicio de sesion fallido ");
            return signToken(user._id.toString());
        },
        createPokemon: async (_, { name, description, height, weight,types},{user}) => {
            if(!user) throw new Error("Inicia sesion para hacer esto")
                const result = await createPokemon(name,description, height, weight,types);
            return result;
        },
    },
}