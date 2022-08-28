/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from "framer-motion";
import { NextPage, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { useState } from "react";
import Input from "../components/Input";
import {
  AdresseIcon,
  EmailIcon,
  EtablissementIcon,
  MapIcon,
  NavBackIcon,
  PersonIcon,
  ShortTextIcon,
  TelIcon,
} from "../constants/icons";

export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const Inscription = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  return (
    <>
      <Head>
        <title></title>
      </Head>
      <main className="flex flex-row items-stretch p-2 md:p-5 md:h-screen gap-5 bg-base-200 md:overflow-hidden">
        <SideContent />
        <SideForm />
      </main>
    </>
  );
};

const SideForm = () => {
  const { t } = useTranslation();
  const [etablissement, setetablissement] = useState<string>("")
  const [abrev, setabrev] = useState("")
  const [identifiant, setidentifiant] = useState("")
  const [paysVille, setpaysVille] = useState("")
  const [address, setaddress] = useState("")
  const [responsable, setresponsable] = useState("")
  const [email, setemail] = useState("")
  const [tel, settel] = useState("")
  return (
    <motion.div
      initial={{
        x: 100,
        scale: 1,
      }}
      animate={{
        x: 0,
        scale: 1,
      }}
      transition={{ duration: 0.5 }}
      className="flex-grow h-full p-3 md:p-10 text-center md:text-left md:overflow-y-scroll"
    >
      <form className="mx-auto max-w-xl">
        <h2>{t("inscription.SideForm title")}</h2>
        <p>{t("inscription.SideForm description")}</p>
        <div className="h-6 md:h-10"></div>
        <div className="form-control flex flex-col gap-3 md:gap-5">
     
          <Input
            icon={  <EtablissementIcon className="icon" />}
            value={etablissement}
            setValue={setetablissement}
            placeholder="inscription.nom"
            required

          />
          <div className="flex flex-col md:flex-row gap-3 md:gap-5">
          <Input
            icon={  <ShortTextIcon className="icon" />}
            value={abrev}
            setValue={setabrev}
            placeholder="inscription.abrev"
            required

          />
            <Input
            icon={  <ShortTextIcon className="icon" />}
            value={identifiant}
            setValue={setidentifiant}
            placeholder="inscription.numero/identifiant"
           

          />

          </div>
         
              <Input
            icon={    <MapIcon className="icon" />}
            value={paysVille}
            setValue={setpaysVille}
            placeholder="inscription.pays/ville"
            required

          />
          
        
          <Input
            icon={   <AdresseIcon className="icon" />}
            value={address}
            setValue={setaddress}
            placeholder="inscription.adresse"
            

          />
          
          <div className="divider"></div>
          <Input
            icon={ <PersonIcon className="icon" />}
            value={responsable}
            setValue={setresponsable}
            placeholder="inscription.responsable"
            required

          />
       <div className="flex flex-col md:flex-row gap-3 md:gap-5">
       <Input
            icon={<EmailIcon className="icon" />}
            value={email}
            setValue={setemail}
            placeholder="inscription.email"
            required
            type="email"
          />
             <Input
            icon={<TelIcon className="icon" />}
            value={tel}
            setValue={settel}
            placeholder="inscription.tel"
            required
            type="tel"
          />
       </div>
        </div>
        <div className="mt-[40px] md:mt-[100px]">
          <button type="submit" className="btn w-full">
            {t("inscription.submit")}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

const SideContent = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      transition={{
        duration: 0.5,
        delay: 0.3,
      }}
      initial={{ x: -1000, opacity: 0.4 }}
      animate={{ x: 0, opacity: 1 }}
      className="rounded-lg bg-primary w-[400px] lg:w-[500px] hidden h-full lg:flex flex-col p-10"
    >
      <div className="flex-grow flex flex-col justify-center text-white gap-5">
        <h1>{t("inscription.SideContent title")}</h1>

        <p className="opacity-70"></p>
      </div>
      {/* <div className="h-[230px]  bg-primary-focus"></div> */}
    </motion.div>
  );
};
export default Inscription;
