import { z } from "zod";
import { createRouter } from "./../context";



export const formationRouter = createRouter().mutation("new", {
  input: z.object({
    etablissement: z.string(),
    more: z.any()
  }),
  async resolve({ input, ctx }) {
    const { prisma } = ctx;
    const { intitule, intituleDiff, version, peutAvoir, estVirtuel, diplomeIntitule, exp, mois, annee } = input.more;

    // peutAvoir ? undefined :
    const diplome = await prisma.diplome.create({
      data: {
        intituleDiff,
        intitule: intituleDiff ? diplomeIntitule : undefined,
        estVirtuel,
        expiration: exp,
        dureeExpiration: parseInt(mois) + 12 * parseInt(annee)
      }
    })
    //TODO:in case parseInt(version)==null 
    return await prisma.formation.create({
      data: {
        intitule,
        etablissementId: input.etablissement,
        versionnage: peutAvoir,
        diplomeId: peutAvoir ? undefined : diplome.id,
        versions: {
          create: peutAvoir ? [
            {
              diplomeId: diplome.id,
              numero: parseInt(version)
            }
          ] : undefined
        }
      },
    })
  }
}).mutation('update title', {
  input: z.object({
    id: z.string(),
    intitule: z.string()
  }),
  async resolve({ input, ctx }) {
    return await ctx.prisma.formation.update({
      where: {
        id:input.id
      },
      data: {
        intitule: input.intitule
      }
    })
  }
}).mutation('delete',{
  input:z.string(),
  async resolve({input,ctx}){
    return await ctx.prisma.formation.delete({
      where:{
        id:input
      }
    })
  }
})