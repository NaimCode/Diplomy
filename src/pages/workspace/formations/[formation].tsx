import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { prisma } from "../../../server/db/client";

import { motion } from "framer-motion";
import { useMyTransition } from "../../../utils/hooks";
import { AddFileIcon } from "../../../constants/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import InputForm from "../../../components/InputForm";
import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import { toast } from "react-toastify";
import router from "next/router";
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
        email: session.user?.email || "",
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
      etablissement: utilisateur.etablissement,

      ...(await serverSideTranslations(context.locale || "", ["common"])),
    },
  };
};
//TODO: added ability to choose template

export type InputsFormation = {
  peutAvoir: boolean;
  intituleDiff: boolean;
  version: number;
  intitule: string;
  diplomeIntitule: string;
  exp: boolean;
  annee: number;
  mois: number;
};
const FormationItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { isNew } = props;
  //const { formations } = props.etablissement;
  const { t } = useTranslation();
  const add = trpc.useMutation(["formation.new"], {
    onSuccess: () => {
      toast.info(t("global.toast succes"));
      setTimeout(() => {
        router.push("/workspace/formations");
      }, 2000);
    },
    onError: (err) => {
      console.log(err);
      add.reset()
      toast.error(t("global.toast erreur"));
    },
  });

  //React hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<InputsFormation>({
    defaultValues: {
      peutAvoir: true,
      intituleDiff: true,

      version: 1,

      exp: false,
    },
  });

  const onSubmit: SubmitHandler<InputsFormation> = (data) =>
    add.mutate({ etablissement: props.etablissement.id, more: {...data,estVirtuel} });

  ///
  const [estVirtuel, setestVirtuel] = useState(false);
  const { controls } = useMyTransition({ trigger: watch("peutAvoir") });
  const { controls: ctl2 } = useMyTransition({
    trigger: watch("intituleDiff"),
  });

  const { controls: ctl3 } = useMyTransition({ trigger: watch("exp") });
  const { controls: ctl4 } = useMyTransition({ trigger: estVirtuel });
  return (
    <>
      <Workspace>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-3 md:px-6 max-w-[700px] mx-auto space-y-3"
        >
          {isNew && (
            <h1 className="text-xl lg:text-4xl">
              {t("workspace.formation.nouvelle")}
            </h1>
          )}

          <InputForm
            register={register("intitule", {
              required: true,
            })}
            label={t("workspace.formation.intitule")}
            placeholder={t("workspace.formation.saisir")}
            error={errors.intitule}
          />
          <InputForm
            register={register("peutAvoir")}
            label={t("workspace.formation.peut avoir")}
            error={errors.peutAvoir}
            toggle
          />

          <motion.div
            animate={controls}
            className="flex flex-row justify-between items-center px-1"
          >
            <span className="label-text">
              {t("workspace.formation.version form")}
            </span>
            <InputForm
              register={register("version")}
              containerClass="w-[100px]"
              inputClass="input-sm text-center"
              error={errors.intitule}
            />
          </motion.div>
          <div className="py-2 lg:py-3" />
          <div className="card  bg-base-100 shadow-xl border-[1px]">
            <div className="card-body">
              <h2 className="card-title">{t("global.diplome/attestation")}</h2>
              <InputForm
                register={register("intituleDiff")}
                label={t("workspace.formation.meme intitule")}
                error={errors.intituleDiff}
                toggle
              />
              <motion.div animate={ctl2}>
                <InputForm
                  register={register("diplomeIntitule")}
                  error={errors.intitule}
                  inputClass="input-sm"
                />
              </motion.div>
              <InputForm
                register={register("exp")}
                label={t("workspace.formation.expiration")}
                error={errors.exp}
                toggle
              />
              {/* <div className="form-control">
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
              </div> */}
              <motion.div
                animate={ctl3}
                className="flex flex-row justify-between items-center px-1"
              >
                <span className="label-text">
                  {t("workspace.formation.duree de validite")}
                </span>

                <div className="flex flex-row items-center gap-2">
                  <InputForm
                    register={register("annee")}
                    error={errors.intitule}
                    placeholder={t("workspace.formation.annee")}
                    containerClass="w-[80px]"
                    inputClass="input-sm text-center placeholder:text-sm"
                  />
                  {/* <input
                    placeholder={t("workspace.formation.annee")}
                    className="input input-bordered input-sm w-[60px] text-right"
                    value={duree.annee || "0"}
                    onChange={(e: any) =>
                      setduree({ ...duree, annee: parseInt(e.target.value) })
                    }
                  /> */}
                  /{" "}
                  <InputForm
                    register={register("mois")}
                    error={errors.intitule}
                    placeholder={t("workspace.formation.mois")}
                    containerClass="w-[80px]"
                    inputClass="input-sm text-center placeholder:text-sm"
                  />
                  {/* <input
                    placeholder={t("workspace.formation.mois")}
                    className="input input-bordered input-sm w-[60px] text-right"
                    value={duree.mois || "0"}
                    onChange={(e: any) =>
                      setduree({ ...duree, mois: parseInt(e.target.value) })
                    }
                  /> */}
                </div>
              </motion.div>

              <div className="flex flex-row gap-2 items-center justify-between px-1">
                <label className="label-text">
                  {t("workspace.formation.type")}
                </label>

                <div className="mt-3 flex flex-row items-center gap-1 lg:gap-2 ">
                  <input
                    placeholder="_"
                    type="radio"
                    name="radio-2"
                    className="radio radio-secondary"
                    checked={!estVirtuel}
                    onChange={() => setestVirtuel(false)}
                  />{" "}
                  <span>{t("workspace.formation.physique")}</span>
                  <div className="px-1 lg:px-3" />
                  <input
                    placeholder="_"
                    type="radio"
                    name="radio-2"
                    className="radio radio-primary"
                    checked={estVirtuel}
                    onChange={() => setestVirtuel(true)}
                  />{" "}
                  <span>{t("workspace.formation.virtuel")}</span>
                </div>
              </div>
              <motion.div
                animate={ctl4}
                className="space-y-2 py-1 lg:py-3 px-1"
              >
                <span className="label-text">
                  {t("workspace.formation.template")}
                </span>
                <div className="aspect-video w-full border-dashed border-2 border-secondary flex flex-ol items-center justify-center transition duration-300 hover:bg-base-200 cursor-pointer">
                  <AddFileIcon className="icon" />
                </div>
              </motion.div>

              {/* <div className="card-actions justify-end">
                <button className="btn btn-primary">Buy Now</button>
              </div> */}
            </div>
          </div>
          <div className="py-2 lg:py-4"></div>
          <button
            type="submit"
            className={`btn btn-block btn-sm lg:btn-md ${
              add.isLoading && "loading"
            }`}
          >
            {t("inscription.valider")}
          </button>
          <div className="py-6 lg:py-6"></div>
        </form>
      </Workspace>
    </>
  );
};

export default FormationItem;
