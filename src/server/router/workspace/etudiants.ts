import { z } from "zod";
import { createRouter } from "../context";

export const etudiantsRouter = createRouter().query("get", {
  input: z.object({
    etablissemntId: z.string(),
    tab: z.enum(["initial", "attente", "certifies"]),
  }),
  async resolve({ input, ctx }) {
    const { etablissemntId, tab } = input;
    const { prisma } = ctx;


    return prisma.etudiant
      .findMany({
        where: {
          etablissemntId,
        },
      })
      .then((etudiants) => {
        if (tab == "initial") return etudiants;
        if (tab == "attente") return etudiants;
        if (tab == "certifies") return etudiants;
      });
  },
}).mutation('add',{
  input:z.object({
   email:z.string(),
   nom:z.string(),
   prenom:z.string(),
   formationId:z.string(),
   etablissemntId:z.string()
  }),
  async resolve({input,ctx}){
  
    return ctx.prisma.etudiant.create({
      data:input
    })
  }
});
