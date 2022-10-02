import { ContractMembre } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "../context";


const ZContractMembre=z.array(z.object({
    etablissementId:z.string()
}))
export const contractRouter=createRouter().mutation('new contract',{
    input:z.object({
        membres:ZContractMembre
    }),
    async resolve(){

    }
})