import { ContractMembre } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "../context";


const ZContractMembre=z.array(z.object({
    etablissementId:z.string(),
    accept:z.boolean()
}))
export const contractRouter=createRouter().mutation('new contract',{
    input:z.object({
        membres:ZContractMembre
    }),
    async resolve({input,ctx}){
     const {prisma}=ctx
      const allTrue=input.membres.every((m)=>m.accept==true)
     const etape=allTrue?2:1
     return await prisma.contract.create({
        data:{
            etape,
            membres:{
                create:input.membres
            }
        }
     })
    }
})