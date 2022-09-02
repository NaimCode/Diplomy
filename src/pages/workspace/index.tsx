import {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { unstable_getServerSession } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import React from "react";
import LogoSVG, { LogoBrand } from "../../components/Logo";
import ProfileCard from "../../components/ProfileCard";
import { HomeIcon } from "../../constants/icons";
import NavBar from "../../partials/NavBar";
import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
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
};
const Workspace: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {

  const { data: session } = useSession();
  return (
  <>
    <main className="relative flex flex-row">
 
 </main>
  </>
  );
};


export default Workspace;
