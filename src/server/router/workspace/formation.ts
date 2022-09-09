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

    
    return await prisma.formation.create({
      data: {
        intitule,
        etablissementId: input.etablissement,
        peutAvoirVersion: peutAvoir,
        version: peutAvoir ? parseInt(version) : undefined
      }
    }).then(async (formation) => await prisma.diplome.create({
      data: {
        intitule: intituleDiff ? diplomeIntitule : undefined,
        intituleDiff,
        formationId: formation.id,
        estVirtuel,
        expiration: exp,
        dureeExpiration: exp ? parseInt(mois) + 12 * parseInt(annee) : undefined
      }
    }))
  }
})