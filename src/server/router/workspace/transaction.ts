import { Transaction } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "../context";


export const transactionRouter=createRouter().mutation("certifier",{
    input:z.object({
        transaction:z.any(),
      etudiantId:z.string(),
      etablissementId:z.string()
    }),
    async resolve({input,ctx}){
  const {prisma}=ctx
    const {etablissementId,etudiantId,transaction}=input

    return await prisma.transaction.create({
        data:{
            ...transaction,
            etablissementId,
            etudiantId
        }
    })
    }
})