import { z } from "zod";
import { createRouter } from "./context";
import { getBaseUrl } from "../../pages/_app";
import { Transporter } from "../../utils/nodemailer";


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
    const data = await prisma.inscription.create({
      data: input,
    })
    await Transporter.sendMail({
      to: process.env.ADMINS_EMAIL,
      from: data.email,
      subject: `Demande d'inscription`,
      html: `<a href="${getBaseUrl()}/admin/inscription?id=${data.id}">Voir la demande</a>`
    })
    return data
  },
}).mutation('inscription accepted', {
  input: z.object({
    id: z.string()
  }),
  async resolve({ input, ctx }) {
    const { id } = input
    const { prisma } = ctx
    const { etablissement, address, paysVille, identifiant, abrev, email } = await prisma.inscription.findUniqueOrThrow({
      where: {
        id
      }
    })

    await prisma.$transaction([
      prisma.etablissement.create({
        data: {
          nom: etablissement,
          address,
          paysVille,
          identifiant,
          membresAutorises: [email],
          abrev
        }
      }),
      prisma.inscription.delete({
        where: {
          id
        }
      }),
    ])
    await Transporter.sendMail({
      to: email,
      from: {name:'Eternum',address:process.env.ADMINS_EMAIL||""},
      subject: `Félicitation`,
      html: `<div><h3>Votre demande d'inscription pour <b>ETERNUM</b> est acceptée 🎉</h3> <a href="${getBaseUrl()}">Mon compte</a></div>`
    })
  }
});
