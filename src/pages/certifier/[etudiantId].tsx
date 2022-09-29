import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from "../../server/db/client";
import { Document, Etablissement, Etudiant } from '@prisma/client';
export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await unstable_getServerSession(
      context.req,
      context.res,
      authOptions
    );

    
  const id=context.query.etudiantId as string
   const etudiant:Etudiant &{document:Document,etablissement:Etablissement} = await prisma.etudiant
   .findUnique({
     where: {
       id,
     },
     include: {
       etablissement: true,
       document:true,
       formation:true
     },
   })
   .then((data) => JSON.parse(JSON.stringify(data)));
    return {
      props: {
        etudiant,
        ...(await serverSideTranslations(context.locale!, ["common"])),
      },
    };
  };
  
const Certifier= ( props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
const {etudiant}=props
  return (
    <div>Certifier</div>
  )
}

export default Certifier