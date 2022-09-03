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

import { authOptions } from "../api/auth/[...nextauth]";
import Nav from '../../partials/Nav';

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
      <main className="relative flex flex-row bg-base-100">
        <section className="sticky top-0 left-0 h-screen w-[300px] bg-base-200 px-6">
          <div className="nav justify-center">
            <LogoBrand />
          </div>
        </section>
        <section className="relative flex-grow">
          <Nav />
        </section>
      </main>
    </>
  );
};

export default Workspace;
