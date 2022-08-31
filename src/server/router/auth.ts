import { z } from "zod";
import { createRouter } from "./context";
import nodemailer from "nodemailer";
import { Transporter } from "../../utils/nodemailer";
import { getBaseUrl } from "../../pages/_app";


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

//TODO: implementing case where email exist
export const authRouter = createRouter().mutation("inscription", {
  input: ZInscription,
  async resolve({ input, ctx }) {
    const { prisma } = ctx;
    return await prisma.inscription.create({
      data: input,
    }).then(async (data) => await Transporter.sendMail({
      to:process.env.ADMINS_EMAIL,
      from:data.email,
      subject: `Demande d'inscription`,
      html: `<a href="${getBaseUrl()}/admin/inscription?id=${data.id}">Voir la demande</a>`
    }));
  },
});
