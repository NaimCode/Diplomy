import { z } from "zod";
import { cloudy } from "../../../utils/cloudinary";
import { createRouter } from "./../context";

export const parametreRouter = createRouter()
  .mutation("update image", {
    input: z.object({
      file: z.string(),
      table: z.enum(["etablissement", "utilisateur"]),
      folder: z.string(),
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      const { id, file, table, folder } = input;

      cloudy.uploader.upload(
        file,
        {
          upload_preset: "ml_default",
          folder,
          public_id: id,
          filename_override: id,
        },
        async (error: any, result: any) => {
          if (!error) {
            switch (table) {
              case "etablissement":
                await prisma?.etablissement.update({
                  where: {
                    id: id,
                  },
                  data: {
                    logo: result.url,
                  },
                });
                break;
              case "utilisateur":
                await prisma?.user.update({
                  where: {
                    email: id,
                  },
                  data: {
                    image: result.url,
                  },
                });
                break;
              default:
                break;
            }
          }
        }
      );
    },
  })
  .mutation("update", {
    input: z.object({
      idEtablissement: z.string(),
      etablissement: z.any(),
      user: z.any(),
      email: z.string(),
    }),
    async resolve({ ctx, input }) {
      const { etablissement, user, idEtablissement, email } = input;

      //TODO: set multi call
      await ctx.prisma.etablissement.update({
        where: {
          id: idEtablissement,
        },
        data: {
          ...etablissement,
        },
      });
      await ctx.prisma.user.update({
        where: {
          email,
        },
        data: {
          ...user,
        },
      });
    },
  });
