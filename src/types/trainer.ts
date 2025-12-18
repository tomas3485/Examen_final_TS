import { ObjectId } from "mongodb"

export type PokeTrainer = {
    _id: ObjectId;
    name: String;
    pokemons: [];
    };