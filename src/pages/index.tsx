/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextPage, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import NavBar from "../partials/NavBar";
import { getStaticPropsTranslations } from "../utils/i18n";

  
export async function getServerSideProps({ locale }: { locale: string }) {
   return {
       props: {
       ...(await serverSideTranslations(locale, ['common'])),
       },
   }
}
const Home = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <Head>
        <title>Diplomy</title>
      </Head>

      <main className="h-screen">
      <NavBar/>
     
      </main>
    </>
  );
};

export default Home;


