/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextPage, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Head from "next/head";
import { AdresseIcon, EmailIcon, EtablissementIcon, MapIcon, NavBackIcon, PersonIcon, ShortTextIcon } from "../constants/icons";

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
      <main className="flex flex-row items-stretch p-2 md:p-5 h-screen gap-5 bg-base-200 overflow-hidden">
        <SideContent />
        <SideForm />
      </main>
    </>
  );
};

const SideForm = () => {
  const { t } = useTranslation();
  return (
    <div className="flex-grow h-full p-3 md:p-10 text-center md:text-left overflow-y-scroll">
      <div className="mx-auto max-w-xl">
        <h2>{t("inscription.SideForm title")}</h2>
        <p>{t("inscription.SideForm description")}</p>
        <div className="h-6 md:h-10"></div>
        <div className="form-control flex flex-col gap-3 md:gap-5">
          <label className="input-group input-group-lg">
            <span>
              <EtablissementIcon className="icon" />
            </span>

            <input
              type="text"
              placeholder={t("inscription.nom")}
              className="input flex-grow w-full focus:input-secondary border-2"
            />
          </label>

          <div className="flex flex-col md:flex-row gap-3 md:gap-5">
          <label className="input-group input-group-lg">
            <span>
              <ShortTextIcon className="icon" />
            </span>

            <input
              type="text"
              placeholder={t("inscription.abrev")}
              className="input  flex-grow w-full focus:input-secondary border-2"
            />
            </label>
            <label className="input-group input-group-lg">
            <span>
              <ShortTextIcon className="icon" />
            </span>

            <input
              type="text"
              placeholder={t("inscription.numero/identifiant")}
              className="input   flex-grow w-full focus:input-secondary border-2"
            />
            </label>
          </div>
          <label className="input-group input-group-lg">
            <span>
              <MapIcon className="icon" />
            </span>

          <input
            type="text"
            placeholder={t("inscription.pays/ville")}
            className="input   flex-grow w-full focus:input-secondary border-2"
          />
          </label>
          <label className="input-group input-group-lg">
            <span>
              <AdresseIcon className="icon" />
            </span>

          <input
            type="text"
            placeholder={t("inscription.adresse")}
            className="input   flex-grow w-full focus:input-secondary border-2"
          />
          </label>
          <div className="divider"></div>
          <label className="input-group input-group-lg">
            <span>
              <PersonIcon className="icon" />
            </span>

          <input
            type="text"
            placeholder={t("inscription.responsable")}
            className="input   flex-grow w-full focus:input-secondary border-2"
          />
          </label>
          <label className="input-group input-group-lg">
            <span>
              <EmailIcon className="icon" />
            </span>

          <input
            type="email"
            required
            placeholder={t("inscription.email")}
            className="input   flex-grow w-full focus:input-secondary border-2"
          />
          </label>
        </div>
        <div className="mt-[40px] md:mt-[100px]">
          <button className="btn w-full">{t("inscription.submit")}</button>
        </div>
      </div>
    </div>
  );
};

const SideContent = () => {
  const { t } = useTranslation();
  return (
    <div className="rounded-lg bg-primary w-[400px] lg:w-[500px] hidden h-full lg:flex flex-col p-10">
      <div className="flex-grow flex flex-col justify-center text-white gap-5">
        <h1>{t("inscription.SideContent title")}</h1>
      
        <p className="opacity-70"></p>
      </div>
      {/* <div className="h-[230px]  bg-primary-focus"></div> */}
    </div>
  );
};
export default Inscription;
