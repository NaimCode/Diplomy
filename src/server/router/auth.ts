import { z } from "zod";
import { createRouter } from "./context";

const ZInscription = z.object({
  etablissement: z.string(),
  abrev: z.string(),
  identifiant: z.string().nullable(),
  paysVille: z.string(),
  address: z.string().nullable(),
  responsable: z.string(),
  email: z.string().email(),
  tel: z.string(),
});

export const authRouter = createRouter().mutation("inscription", {
  input: ZInscription,
  async resolve({ input, ctx }) {
    const { prisma } = ctx;
    return await prisma.inscription.create({
      data: input,
    });
  },
});
