import { z } from "zod";
import { createRouter } from "./context";
import nodemailer from "nodemailer";
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
    const data= await prisma.inscription.create({
      data: input,
    })
    const Transporter= nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
    await Transporter.sendMail({
      to:process.env.ADMINS_EMAIL,
      from:data.email,
      subject: `Demande d'inscription`,
      html: `<a href="${getBaseUrl()}/admin/inscription?id=${data.id}">Voir la demande</a>`
    })
    return  data
  },
});
