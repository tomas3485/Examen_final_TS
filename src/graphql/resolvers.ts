import { IResolvers } from "@graphql-tools/utils";
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import {startJourney,login} from "../collections/entrenador";
import {buscapokemonporId,MuestraPokemons,createPokemon} from "../collections/pokemons";
import { p2,p3} from "../utils";
import {PokeTrainer} from "../types/trainer";

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
        miEquipo: async(parent :PokeTrainer)=>{
            const db=getDB();
            const miEquipoPokemon = parent.pokemons;
            const IDsparaPokemons = miEquipoPokemon.map((id) => new ObjectId(id));
            return db.collection(p2).find({ _id: {$in:IDsparaPokemons}}).toArray();
        }
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
        catchPokemon: async (_,{pokemonId,nickname},{user})=>{
            if (!user) throw new Error("No hay usuario");
            const db = getDB();
            const userId = new ObjectId(user._id);
            const IdPokemon = new ObjectId(pokemonId);
            
            const hayPokemon = await db.collection(p2).findOne({_id:IdPokemon});
            if(!hayPokemon) throw new Error ("El pokemon no existe");
            
            await db.collection(p3).updateOne({ _id: userId },{$addToSet : {miEquipo: pokemonId}});

        const updateUser = await db.collection(p3).findOne({
            _id: userId,
        });
        }
    },
}