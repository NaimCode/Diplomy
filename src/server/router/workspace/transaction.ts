/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { Transporter } from "../../../utils/nodemailer";
import { createRouter } from "../context";

export const transactionRouter = createRouter()
  .mutation("certifier", {
    input: z.object({
      transaction: z.any(),
      etudiant: z.any(),
      codeQR: z.string(),
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      const { transaction, codeQR, etudiant } = input;
      const email = etudiant.email;
      const etablissementId = etudiant.etablissemntId;
      const etudiantId = etudiant.id;

      const exist = await prisma.utilisateur.count({
        where: {
          email,
        },
      });
      if (exist == 0) {
        await Transporter.sendMail({
          to: email,
          from: process.env.ADMINS_EMAIL,
          subject: `Félicitation`,
          html: `<div><h3>Votre compte étudiant <b>ETERNUM</b> est créé, veuillez-vous connecter </h3> <a href="${getBaseUrl()}">Mon compte</a></div>`,
        });
      }
      await Transporter.sendMail({
        to: email,
        from: process.env.ADMINS_EMAIL,
        subject: `Document certifié`,
        html: `<div><h3>Vous avez un nouveau document certifié par <b>${etudiant.etablissement.nom}</b></h3> <p>${transaction.hash}</p>
      <a href="${codeQR}">optenir code QR</a>
      </div>`,
      });
      return await prisma.transaction.create({
        data: {
          ...transaction,
          etablissementId,
          etudiantId,
        },
      });
    },
  })
  .mutation("certifier contract", {
    input: z.object({
      transaction: z.any(),
      id: z.string(),
      address: z.string(),
      emails:z.array(z.string()),
      codeQR:z.string()
    }),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
      const { transaction, id, address,codeQR } = input;

 
        await Transporter.sendMail({
          to: input.emails,
          from: {name:"Eternum",address:process.env.ADMINS_EMAI||""},
          subject: `Document certifié`,
          html: `<div><h3>Un contract dont vous faites partie a été signé avec succès</h3> <p>${transaction.hash}</p>
          <a href="${codeQR}">optenir code QR</a>
          </div>`
        })

      return await prisma.contract.update({
        where: {
          id,
        },
        data: {
          address,
          transaction: {
            create: {
              ...transaction,
            },
          },
        },include:{
          transaction:true
        }
      });
    },
  }).mutation("certifier multiple", {
    input: z.array(z.object({
      transaction: z.any(),
      etudiant: z.any(),
      
      codeQR: z.string(),
      
    })),
    async resolve({ input, ctx }) {
      const { prisma } = ctx;
   
      for(const i of input){
        const { transaction, codeQR, etudiant } = i;
        const email = etudiant.email;
       

        await Transporter.sendMail({
          to: email,
          from: process.env.ADMINS_EMAIL,
          subject: `Document certifié`,
          html: `<div><h3>Vous avez un nouveau document certifié par <b>${etudiant.etablissement.nom}</b></h3> <p>${transaction.hash}</p>
        <a href="${codeQR}">optenir code QR</a>
        </div>`,
        });

      }
      const { transaction, etudiant } = input[0] as {
        transaction?: any;
        etudiant?: any;
        codeQR: string;
    };
    return await prisma.transaction.create({
      data: {
        ...transaction,
        etablissementId:etudiant.etablissementId
      },
    })
    },
  });
