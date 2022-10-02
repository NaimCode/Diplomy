import { Etudiant } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "../context";

//TODO: check just if etudian has doc
const getInitialEtudiants = (etudiants: Array<any>) => {
  return etudiants.filter((e) => {
    if (!e.documentId) {
      return true;
    }
  });
};

const getAttenteEtudiants = (etudiants: Array<any>) => {
  return etudiants.filter((e) => {
    if (e.documentId && !e.transaction) {
      return true;
    }
  });
};

const getCertifiesEtudiants = (etudiants: Array<any>) => {
  return etudiants.filter((e) => {
    if (e.transaction && !e.removed) {
      return true;
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
            
            document:true,
            transaction:true,
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
          if (tab == "attente") return getAttenteEtudiants(etudiants);
          if (tab == "certifies") return getCertifiesEtudiants(etudiants);
        });
    },
  })
  .mutation("add", {
    input: z.object({
      data: z.object({
        email: z.string(),
        nom: z.string(),
        prenom: z.string(),
        formationId: z.string(),
        etablissemntId: z.string(),
      }),
      isVirtuel: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      const hash = "QmUnxr5A8epU3gThy4ZQHrAi9Gqz6eAUCpQfsaoF6pgfx6";
      if (input.isVirtuel) {
        const doc = await ctx.prisma.document.create({
          data: {
            hash,
            type: "IMAGE",
          },
        });
        return ctx.prisma.etudiant.create({
          data: {
            ...input.data,
            documentId: doc.id,
          },
        });
      } else {
        return ctx.prisma.etudiant.create({
          data: input.data,
        });
      }
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
  })
  .mutation("add doc", {
    input: z.object({
      idEtudiant: z.string(),
      type: z.enum(["IMAGE", "PDF"]),
      hash: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.etudiant.update({
        where: {
          id: input.idEtudiant,
        },
        data: {
          document: {
            create: {
              type: input.type,
              hash: input.hash,
            },
          },
        },
      });
    },
  }).mutation('removed certifies',{
    input:z.string(),
    async resolve({input,ctx}){
      const {prisma}=ctx

      return await prisma.etudiant.updateMany({
        where:{
          etablissemntId:input
        },
        data:{
            removed:true
        }
      })
    }
  });
