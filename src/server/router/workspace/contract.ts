import { ContractMembre, Etablissement } from "@prisma/client";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { Transporter } from "../../../utils/nodemailer";
import { createRouter } from "../context";

const ZContractMembre = z.array(
  z.object({
    etablissementId: z.string(),
    accept: z.boolean(),
   
  })
);
export const contractRouter = createRouter()
  .mutation("new contract", {
    input: z.object({
      membres: ZContractMembre,
      etablissements:z.array(z.any())
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      const allTrue = input.membres.every((m) => m.accept == true);
      const etape = allTrue ? 2 : 1;
      if(etape==1){
       
        // console.log('ids');
        // const ids=input.membres.filter((f,i)=>i!=0).map(m=>m.etablissementId)
        // // console.log('ids', ids)
        // console.log('list');
        // const listEmail=input.etablissements.filter((f:Etablissement)=>ids.includes(f.id)).map((e)=>e.membresAutorises[0])
        // console.log('before');

        // await Transporter.sendMail({
        //   to: listEmail[0],
        //   from: process.env.ADMINS_EMAIL,
        //   subject: `Demande de parténariat`,
        //   html: `<div><h3>Vous venez de recevoir une demande de parténariat, veuillez vous connectez pour l'accepter ou refuser</h3> <a href="${getBaseUrl()}/workspace/relation">Mon space de relation</a></div>`
        // }).catch((err)=>{
        //   console.log('error sending email new contract', err)
        // })
        // console.log('after');
      }
      return await prisma.contract.create({
        data: {
          etape,
          membres: {
            create: input.membres,
          },
        },
      });
    },
  })
  .query("step", {
    input: z.string(),
    async resolve({ input, ctx }) {
      return await ctx.prisma.contract.findUnique({
        where: {
          id: input,
        },
        select: {
          etape: true,
        },
      });
    },
  })
  .mutation("finalisation", {
    input: z.object({
      formations: z.array(z.string()),
      aboutissement: z.string(),
      id: z.string(),
      membreId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      return await prisma.$transaction([
        prisma.contract.update({
          where: {
            id: input.id,
          },
          data: {
            etape: 4,
            conditionsId: input.formations,
            aboutissementId: input.aboutissement,
          },
        }),
        prisma.contractMembre.update({
          where: {
            id: input.membreId,
          },
          data: {
            confirm: true,
          },
        }),
      ]);
    },
  })
  .query("demandes", {
    async resolve({ ctx }) {
      const { session, prisma } = ctx;

      return await prisma.contract.findMany({
        where: {
          membres: {
            some: {
              accept: false,
              etablissement: {
                membresAutorises: {
                  has: session?.user?.email!,
                },
              },
            },
          },
        },
        include: {
          membres: {
            include: {
              etablissement: true,
            },
          },
        },
      });
    },
  })
  .mutation("demande action", {
    input: z.object({
      action: z.enum(["accept", "refuse"]),
      id: z.string(),
      idMembre: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { prisma } = ctx;
      if (input.action == "accept") {
         await prisma.contractMembre.update({
          where: {
            id: input.idMembre,
          },
          data: {
            accept: true,
          },
        });
        
      } else {
         await prisma.contract.delete({
          where: {
            id: input.id,
          },
        });
      }
      return input.action
    },
  });
