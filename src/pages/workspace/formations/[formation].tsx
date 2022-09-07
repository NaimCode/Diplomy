import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { prisma } from "../../../server/db/client";
import { Formation } from ".prisma/client";
import { useEffect, useState } from "react";
import { Presets } from "react-component-transition";
import { ComponentTransition, AnimationTypes } from "react-component-transition";
import { motion, useAnimationControls } from "framer-motion";
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
  const utilisateur = await prisma.utilisateur
    .findUnique({
      where: {
        email: session.user?.email!,
      },
      include: {
        etablissement: true,
        // {
        //   include: {
        //     formations: true,
        //   },
        // },
      },
    })
    .then((data) => JSON.parse(JSON.stringify(data)));

  return {
    props: {
      isNew: context.query.formation == "ajouter",
      etablissement: utilisateur?.etablissement!,

      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const FormationItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const controlsVersion = useAnimationControls()
  const { isNew } = props;
  const { formations } = props.etablissement;
  const { t } = useTranslation();
  const [peutAvoir, setpeutAvoir] = useState(true);
  const [version, setversion] = useState("1");
  const [initule, setinitule] = useState("");
  useEffect(()=>{
      if(!peutAvoir){
controlsVersion.start({
    opacity:0,
    x:-100,
    height:0
})
      }else{
        controlsVersion.start({
            opacity:1,
            x:0,
            height:"auto"
        })
      }
  },[peutAvoir])
  return (
    <>
      <Workspace>
        <div className="px-3 md:px-6 max-w-[700px] mx-auto space-y-3">
          {isNew && (
            <h1 className="text-xl lg:text-4xl">
              {t("workspace.formation.nouvelle")}
            </h1>
          )}

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">
                {t("workspace.formation.intitule")}
              </span>
            </label>
            <input
              type="text"
              placeholder={t("workspace.formation.saisir")}
              className="input input-bordered w-full"
            />
          </div>
          <div className="form-control">
            <label className="label cursor-pointer">
              <span className="label-text">
                {t("workspace.formation.peut avoir")}
              </span>
              <input
                type="checkbox"
                className="toggle"
                checked={peutAvoir}
                onChange={(e) => {
                    
                    setpeutAvoir(e.target.checked)
                
                }}
              />
            </label>
          </div>
          <motion.div animate={controlsVersion} className="flex flex-row justify-between items-center px-1">
            <span className="label-text">
              {t("workspace.formation.version form")}
            </span>
            <input
              placeholder="_"
              className="input input-bordered input-sm w-[100px] text-center"
              value={version}
              onChange={(e: any) => setversion(e.target.value)}
            />
          </motion.div>
          
          <div className="card  bg-base-100 shadow-xl border-[1px]">
            <div className="card-body">
              <h2 className="card-title">{t("global.diplome/attestation")}</h2>
              <p>If a dog chews shoes whose shoes does he choose?</p>
              {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
              </div> */}
            </div>
          </div>
        </div>
      </Workspace>
    </>
  );
};

export default FormationItem;
