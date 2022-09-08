import { z } from "zod";
import { createRouter } from "./../context";

import { Etablissement } from "@prisma/client";


const ZInscription = z.object({
  intitule: z.string(),
  intituleDiff: z.boolean(),
  peutAvoirVersion: z.boolean(),
  estVirtuel: z.boolean(),
  identifiant: z.string().nullable(),
  paysVille: z.string(),
  address: z.string().nullable(),
  responsable: z.string(),
  email: z.string().email(),
  tel: z.string(),

});

//TODO: implementing case where email exist
export const formationRouter = createRouter().mutation("new", {
  input: ZInscription,
  async resolve({ input, ctx }) {
    const { prisma } = ctx;
    // const data = await prisma.inscription.create({
    //   data: input,
    // })
    
  },
})