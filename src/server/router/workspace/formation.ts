import { z } from "zod";
import { createRouter } from "./../context";


//@todo
//@note
//@remind

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
        dureeExpiration: exp ? parseInt(mois) + 12 * parseInt(annee) : undefined
      }
    })

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
        id: input.id
      },
      data: {
        intitule: input.intitule
      }
    })
  }
}).mutation('delete', {
  input: z.string(),
  async resolve({ input, ctx }) {
    return await ctx.prisma.formation.delete({
      where: {
        id: input
      }
    })
  }
}).mutation('new version', {
  input: z.object({

    formation: z.any(),
    more: z.any()
  }),
  async resolve({ input, ctx }) {
    const { prisma } = ctx
    const { more, formation } = input
    const { intituleDiff, version, estVirtuel, diplomeIntitule, exp, mois, annee } = more;

    // peutAvoir ? undefined :
    const diplome = await prisma.diplome.create({
      data: {
        intituleDiff,
        intitule: intituleDiff ? diplomeIntitule : undefined,
        estVirtuel,
        expiration: exp,
        dureeExpiration: exp ? parseInt(mois) + 12 * parseInt(annee) : undefined
      }
    })

    return await prisma.version.create({

      data: {
        formationId: formation.id,
        numero: parseInt(version),
        diplomeId: diplome.id
      }
    })
  }
})