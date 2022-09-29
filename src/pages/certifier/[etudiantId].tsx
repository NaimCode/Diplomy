import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useEffect, useState } from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from "../../server/db/client";
import { Document, Etablissement, Etudiant } from '@prisma/client';
import { useWeb3Connection } from '../../utils/web3';
import MyLottie from '../../components/MyLottie';
import animationData from "../../../public/lotties/ether_loading.json"
import { useTranslation } from 'next-i18next';
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
const web3=useWeb3Connection()

if(web3.isLoading){
  return <Loading/>
}
  return (
    <div className='bg-base-100'>
      <button onClick={()=>{
       web3.connect()
      }} className="btn">Activate</button>
      <button onClick={()=>{
       web3.disconnect()
      }} className="btn">desic</button>
      <h2>
        {web3.account}
      </h2>
    </div>
  )
}


const Loading=()=>{
  const {t}=useTranslation()
  return <div className='bg-base-100 h-screen w-screen flex flex-col justify-center items-center'>
     <div className='max-w-[400px] flex flex-col justify-center items-center'>
     <MyLottie animationData={animationData}/>
      <p className='-translate-y-[80px]'>{t('global.chargement')}</p>
     </div>
  </div>
}

export default Certifier