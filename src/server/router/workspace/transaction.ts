import { z } from "zod";
import { createRouter } from "../context";


export const transactionRouter=createRouter().mutation("certifier",{
    input:z.object({
        transaction:z.object({}),

    }),
    async resolve({input,ctx}){
  const {prisma}=ctx
  
    }
})