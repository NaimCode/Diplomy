import { Etudiant } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "../context";


//TODO: check just if etudian has doc
const getInitialEtudiants = (etudiants: Array<any>) => {
  return etudiants.filter((e) => {
    if(e.document){
      return 
    }
    if (e.formation.versionnage) {
      return !e.formation.versions[e.formation.versions.length - 1].diplome
        .estVirtuel;
    } else {
      return !e.formation.diplome.estVirtuel;
    }
  });
};

export const etudiantsRouter = createRouter()
  .query("get", {
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
          include: {
            formation: {
              include: {
                diplome: true,
                versions: {
                  include: {
                    diplome: true,
                  },
                },
              },
            },
          },
        })
        .then((etudiants: Array<Etudiant>) => {
          if (tab == "initial") return getInitialEtudiants(etudiants);
          if (tab == "attente") return etudiants;
          if (tab == "certifies") return etudiants;
        });
    },
  })
  .mutation("add", {
    input: z.object({
      email: z.string(),
      nom: z.string(),
      prenom: z.string(),
      formationId: z.string(),
      etablissemntId: z.string(),
    }),
    async resolve({ input, ctx }) {
      
      return ctx.prisma.etudiant.create({
        data: input,
      });
    },
  })
  .mutation("delete", {
    input: z.string(),
    async resolve({ ctx, input }) {
      return await ctx.prisma.etudiant.delete({
        where: {
          id: input,
        },
      });
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      data: z.object({
        email: z.string(),
        nom: z.string(),
        prenom: z.string(),
        formationId: z.string(),
        etablissemntId: z.string(),
      }),
    }),
    async resolve({ input, ctx }) {
      return ctx.prisma.etudiant.update({
        where: {
          id: input.id,
        },
        data: input.data,
      });
    },
  }).mutation('add doc',{
    input:z.object({
      idEtudiant:z.string(),
      type:z.enum(['IMAGE','PDF']),
      hash:z.string()
    }),
    async resolve({input,ctx}){
     
      return await ctx.prisma.etudiant.update({
        where:{
          id:input.idEtudiant
        },
        data:{
          document:{
            create:{
              type:input.type,
              hash:input.hash
            }
          }
        }
      })
    }
  });
