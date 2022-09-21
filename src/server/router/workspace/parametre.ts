import { z } from "zod";
import { cloudy } from "../../../utils/cloudinary";
import { createRouter } from "./../context";

export const parametreRouter = createRouter().mutation("update image", {
  input: z.object({
    file: z.string(),
    isLogo: z.boolean().nullable(),
    id: z.string(),
  }),
  async resolve({ input, ctx }) {
    const { prisma } = ctx;
    const { id, isLogo, file } = input;

    cloudy.uploader.upload(
      file,
      {
        upload_preset: "ml_default",
        folder: "logo",
        public_id:id,
        filename_override: id,
      },
      async (error: any, result: any) => {
        if (isLogo) {
          if (!error) {
            await prisma?.etablissement.update({
              where: {
                id: id,
              },
              data: {
                logo: result.url,
              },
            });
          }
        }
      }
    );
  },
});
