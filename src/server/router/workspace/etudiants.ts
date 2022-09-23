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
    console.log(etablissemntId);

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
});
