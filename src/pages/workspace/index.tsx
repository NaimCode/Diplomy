import { GetServerSideProps, NextPage, InferGetServerSidePropsType } from 'next'
import { unstable_getServerSession } from 'next-auth';
import { signOut, useSession } from 'next-auth/react'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]';


export const getServerSideProps:GetServerSideProps =async (context)=> {
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      );
    
      if (!session) {
        return {
          redirect: {
            destination: "/",
            permanent: true,
          },
        };
      }
    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ["common"])),
      },
    };
  }
const Workspace:NextPage = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const {data:seesion}=useSession()
  return (
    <div>
   <h2>{seesion?.user?.name}</h2>
        <button title='logOut' className='btn btn-secondary' onClick={()=>signOut()}>LogOut</button></div>
  )
}

export default Workspace