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
import {
  ComponentTransition,
  AnimationTypes,
} from "react-component-transition";
import { motion, useAnimationControls } from "framer-motion";
import { useMyTransition, useDimensionFromEl } from "../../../utils/hooks";
import { AddFileIcon } from "../../../constants/icons";
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
  const { isNew } = props;
  const { formations } = props.etablissement;
  const { t } = useTranslation();
  //TODO: set false
  const [peutAvoir, setpeutAvoir] = useState(true);
  const [intituleDiff, setintituleDiff] = useState(true);
  const [estVirtuel, setestVirtuel] = useState(false);
  const [version, setversion] = useState("1");
  const [intitule, setintitule] = useState("");
  const [diplomeIntitule, setdiplomeIntitule] = useState("");
  const [exp, setexp] = useState(false);
  const [duree, setduree] = useState<{ annee?: number; mois?: number }>({});
  const { controls } = useMyTransition({ trigger: peutAvoir });
  const { controls: ctl2 } = useMyTransition({ trigger: intituleDiff });
  const { controls: ctl3 } = useMyTransition({ trigger: exp });
  const { controls: ctl4 } = useMyTransition({ trigger: estVirtuel });
  const { ref, show, dimension } = useDimensionFromEl();
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
              value={intitule}
              onChange={(e) => setintitule(e.target.value)}
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
                className="toggle toggle-primary"
                checked={peutAvoir}
                onChange={(e) => {
                  setpeutAvoir(e.target.checked);
                }}
              />
            </label>
          </div>
          <motion.div
            animate={controls}
            className="flex flex-row justify-between items-center px-1"
          >
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
          <div className="py-2 lg:py-3" />
          <div className="card  bg-base-100 shadow-xl border-[1px]">
            <div className="card-body">
              <h2 className="card-title">{t("global.diplome/attestation")}</h2>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    {t("workspace.formation.meme intitule")}
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={intituleDiff}
                    onChange={(e) => {
                      setintituleDiff(e.target.checked);
                    }}
                  />
                </label>
              </div>
              <motion.div animate={ctl2}>
                <input
                  className="input input-bordered input-sm w-full"
                  value={diplomeIntitule}
                  onChange={(e) => setdiplomeIntitule(e.target.value)}
                  placeholder={t("workspace.formation.saisir")}
                />
              </motion.div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">
                    {t("workspace.formation.expiration")}
                  </span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={exp}
                    onChange={(e) => {
                      setexp(e.target.checked);
                    }}
                  />
                </label>
              </div>
              <motion.div
                animate={ctl3}
                className="flex flex-row justify-between items-center px-1"
              >
                <span className="label-text">
                  {t("workspace.formation.duree de validite")}
                </span>

                <div className="flex flex-row items-center gap-2">
                  <input
                    placeholder={t("workspace.formation.annee")}
                    className="input input-bordered input-sm w-[60px] text-right"
                    value={duree.annee || "0"}
                    onChange={(e: any) =>
                      setduree({ ...duree, annee: parseInt(e.target.value) })
                    }
                  />
                  /{" "}
                  <input
                    placeholder={t("workspace.formation.mois")}
                    className="input input-bordered input-sm w-[60px] text-right"
                    value={duree.mois || "0"}
                    onChange={(e: any) =>
                      setduree({ ...duree, mois: parseInt(e.target.value) })
                    }
                  />
                </div>
              </motion.div>

              <div className="flex flex-row gap-2 items-center justify-between px-1">
                <label className="label-text">
                  {t("workspace.formation.type")}
                </label>

                <div className="flex flex-row gap-1 lg:gap-2">
                  <input
                    placeholder="_"
                    type="radio"
                    name="radio-2"
                    className="radio radio-primary"
                    checked={!estVirtuel}
                    onChange={(e) => setestVirtuel(false)}
                  />{" "}
                  <span>{t("workspace.formation.physique")}</span>
                  <div className="px-1 lg:px-3" />
                  <input
                    placeholder="_"
                    type="radio"
                    name="radio-2"
                    className="radio radio-primary"
                    checked={estVirtuel}
                    onChange={(e) => setestVirtuel(true)}
                  />{" "}
                  <span>{t("workspace.formation.virtuel")}</span>
                </div>
              </div>
              <motion.div animate={ctl4} className="space-y-2 py-1 lg:py-3 px-1">
                  <span className="label-text">
                      {t('workspace.formation.template')}
                  </span>
                <div className="aspect-video w-full border-dashed border-2 border-secondary flex flex-ol items-center justify-center transition duration-300 hover:bg-base-200 cursor-pointer">
                    <AddFileIcon className="icon"/>
                </div>
              </motion.div>

              {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
              </div> */}
            </div>
          </div>
          <div className="py-2 lg:py-4"></div>
          <button className="btn btn-block btn-sm lg:btn-md">{t('inscription.valider')}</button>
          <div className="py-6 lg:py-6"></div>
        </div>
      </Workspace>
    </>
  );
};

export default FormationItem;
