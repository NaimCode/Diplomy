import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useMyTheme } from "../../utils/hooks";
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
const Contract = () => {
  const { t } = useTranslation();
  const [avecMe, setavecMe] = useState(false);
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[700px]  py-6 space-y-10">
        <p className="text-center py-3 px-2 bg-warning/20">
          {text("step 1 exp")}
        </p>
        <Steps t={t} />
        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">{text("sans partenaire")}</span>
            <input
              type="checkbox"
              className="toggle"
              checked={avecMe}
              onChange={(e) => setavecMe(e.target.checked)}
            />
          </label>
        </div>
       
        <div className="divider"></div>
        <div className="flex flex-row justify-between items-center">
          <button className="btn btn-ghost">{t("global.retour")}</button>
          <button className="btn btn-primary">{t("global.valider")}</button>
        </div>
      </div>
    </div>
  );
};

const Steps = ({ t }: { t: any }) => {
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <ul className="steps w-full">
      <li className="step step-primary text-primary">{text("step 1")}</li>
      <li className="step">{text("step 2")}</li>
      <li className="step">{text("step 3")}</li>
      <li className="step">{text("step 4")}</li>
    </ul>
  );
};


export default Contract;
