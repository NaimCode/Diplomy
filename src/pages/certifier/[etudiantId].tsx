import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { Fragment, useEffect, useState } from 'react'
import { authOptions } from '../api/auth/[...nextauth]';
import { prisma } from "../../server/db/client";
import { Document, Etablissement, Etudiant } from '@prisma/client';
import { useWeb3Connection } from '../../utils/web3';
import MyLottie from '../../components/MyLottie';
import animationData from "../../../public/lotties/ether_loading.json"
import animationData2 from "../../../public/lotties/checkout.json"
import { useTranslation } from 'next-i18next';
import { CheckIcon, DiplomaIcon, EmailIcon, PersonIcon } from '../../constants/icons';
import { GATEWAY_IPFS, useMyTransition } from '../../utils/hooks';
import { motion } from 'framer-motion';

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
const {etudiant}=props
const {controls}=useMyTransition({trigger:web3.active&&!web3.isLoading})
const {t}=useTranslation()
if(web3.isLoading){
  return <Loading/>
}

  return (
    <div className='w-screen h-screen bg-base-100 flex justify-center'>
      <div className='flex w-full flex-col gap-2 max-w-2xl p-5 lg:p-2 h-[300px]'>
        <div>
        <MyLottie animationData={animationData2}/>
        </div>
        <Message web3={web3}/>
         <motion.div animate={controls}>
         <div className='divider'></div>
        <div className='w-full space-y-3'>
        <div className='flex flex-row gap-4 items-center'>
          <PersonIcon className='text-lg'/>
          <h6>{etudiant.prenom} {etudiant.nom}</h6>
          </div>
         <div className='flex flex-row gap-4 items-center'>
          <EmailIcon className='text-lg'/>
         <p>{etudiant.email}</p>
         </div>
         <div className='flex flex-row gap-4 items-center'>
          <DiplomaIcon className='text-lg'/>
         <p>{etudiant.formation.intitule}</p>
         </div>
         <div className='py-3'></div>
         <img src={GATEWAY_IPFS+etudiant.document.hash} alt="doc"/>
        </div>
        <div className='divider'></div>
        <div className='flex items-center justify-center'>
          <button className='btn btn-primary btn-wide'>{t('global.dialog validate')}</button>
        </div>
        <div className='py-10'></div>
         </motion.div>
      </div>
    </div>
  )
}


const Loading=()=>{
  const {t}=useTranslation()
  return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.3}} className='bg-base-100 h-screen w-screen flex flex-col justify-center items-center'>
     <div className='max-w-[400px] flex flex-col justify-center items-center'>
     <MyLottie animationData={animationData}/>
      <p className='-translate-y-[80px]'>{t('global.chargement')}</p>
     </div>
  </motion.div>
}
const Message=({web3}:{web3:{
  connect: () => Promise<void>;
  disconnect: () => void;
  account: string | null | undefined;
  active: boolean;
  isLoading: boolean;
}})=>{
  const {t}=useTranslation()
  return web3.active?
  <div className="alert">
 <div>
   <CheckIcon/>
    <div>
      <h6 className="">{t("web3.actif compte")}</h6>
      <div className="text-xs font-bold">{web3.account}</div>
    </div>
  </div>
  <div className="flex-none">
    <button onClick={()=>web3.disconnect()} className="btn btn-sm btn-warning">{t('web3.deconnexion')}</button>
  </div>
</div>:
  
  <div className="alert alert-error bg-opacity-60 shadow-lg">
  <div>
    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
    <span>{t("web3.veuillez connecter")}</span>
  </div>
  <div className="flex-none">
    <button onClick={()=>web3.connect()} className="btn btn-sm">{t('web3.connexion')}</button>
  </div>
</div>
}
export default Certifier