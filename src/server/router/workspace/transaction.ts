import { Transaction } from "@prisma/client";
import { z } from "zod";
import { getBaseUrl } from "../../../pages/_app";
import { Transporter } from "../../../utils/nodemailer";
import { createRouter } from "../context";


export const transactionRouter=createRouter().mutation("certifier",{
    input:z.object({
        transaction:z.any(),
      etudiant:z.any(),
      codeQR:z.string()
    }),
    async resolve({input,ctx}){
  const {prisma}=ctx
    const {transaction,codeQR,etudiant}=input
  const email=etudiant.email
  const etablissementId=etudiant.etablissemntId
  const etudiantId=etudiant.id


  const exist=await prisma.utilisateur.count({
    where:{
      email
    }
  })
  if(exist==0){
    await Transporter.sendMail({
      to: email,
      from: process.env.ADMINS_EMAIL,
      subject: `Félicitation`,
      html: `<div><h3>Votre compte étudiant <b>ETERNUM</b> est créé, veuillez-vous connecter </h3> <a href="${getBaseUrl()}">Mon compte</a></div>`
    })
  }
    await Transporter.sendMail({
      to: email,
      from: process.env.ADMINS_EMAIL,
      subject: `Document certifié`,
      html: `<div><h3>Vous avez un nouveau document certifié par <b>${etudiant.etablissement.nom}</b></h3> <p>${transaction.hash}</p>
      <a href="${codeQR}">optenir code QR</a>
      </div>`
    })
    return await prisma.transaction.create({
        data:{
            ...transaction,
            etablissementId,
            etudiantId
        }
    })
    }
})