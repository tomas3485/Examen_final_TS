import { IResolvers } from "@graphql-tools/utils";
import { signToken } from "../auth";
import { getDB } from "../db/mongo";
import { ObjectId } from "mongodb";
import { URLSearchParams } from "node:url";
import {createUser,validateUser} from "../collections/users"

export const resolvers:IResolvers = {
    Query:{
        me:async(_,__,{user}) => {
            if(!user)throw new Error("Logeate");
            return {
                _id:user._id.toString(),
                ...user

            }
        }
    },

    User:{
        //esto vacio?
    },
    Mutation: {
        register: async (_,{email,password})=>{
            const idDelClienteCreado = await createUser(email,password);
            return signToken(idDelClienteCreado);
        },
        login: async (_,{email,password})=>{
            const user = await validateUser(email,password);
            if(!user) throw new Error("Malas credenciales");
            return signToken(user._id.toString());
        },

    },
}