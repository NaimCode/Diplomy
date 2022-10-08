/* eslint-disable @typescript-eslint/no-unused-vars */

import type { NextPage, InferGetServerSidePropsType } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import MyLottie from "../components/MyLottie";
import NavBar from "../partials/NavBar";
import { getStaticPropsTranslations } from "../utils/i18n";
import heroAnimation from "../../public/lotties/hero_light.json";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { FileIcon, SearchIcon } from "../constants/icons";

const Home: NextPage = (props) => {
  const { t } = useTranslation();
  return (
    <>
      <main className="bg-base-100 h-screen">
        <NavBar />
        <div className="mt-[70px] lg:mt-0 text-center lg:text-left h-full flex flex-row justify-between mx-auto max-w-7xl items-center relative">
          <div className="h-full w-full lg:w-[50%] z-20 flex justify-center items-center absolute top-0 left-0">
            <div className="w-full backdrop-blur-md bg-base-100/60 rounded-lg p-10 border border-base-200 ">
              <h1 className="text-xl lg:text-2xl text-primary font-logo uppercase font-extrabold drop-shadow-md">
                {t("home.hero title")}
              </h1>
              <div className="py-4"></div>
              <p className="lg:pl-4 lg:border-primary lg:border-l-8">
                {t("home.hero description")}
              </p>
              <div className="divider"></div>
              <div className="flex flex-col lg:flex-row justify-between items-center gap-3">
                <Link href="/inscription">
                  <button className="btn btn-outline gap-2">
                    <FileIcon className="icon" />
                    {t("home.Button inscription")}
                  </button>
                </Link>
                <Link href="/recherche">
                  <button className="btn btn-secondary gap-2">
                    <SearchIcon className="text-lg" />
                    {t("home.rechercher")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[70%] z-10 h-screen lg:h-[70%] absolute bottom-0 lg:top-0 right-0">
            <MyLottie animationData={heroAnimation} />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
