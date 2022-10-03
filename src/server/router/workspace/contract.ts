import { ContractMembre } from "@prisma/client";
import { z } from "zod";
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
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      const allTrue = input.membres.every((m) => m.accept == true);
      const etape = allTrue ? 2 : 1;
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
  .mutation("step 2", {
    input: z.object({
      formations: z.array(z.string()),
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;

      return await prisma.contract.update({
        where: {
          id: input.id,
        },
        data: {
          etape: 3,
          conditionsId: input.formations,
        },
      });
    },
  });
