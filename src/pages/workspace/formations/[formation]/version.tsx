import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]";
import Workspace from "../../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { prisma } from "../../../../server/db/client";

import { motion } from "framer-motion";
import { useMyTransition } from "../../../../utils/hooks";
import { AddFileIcon } from "../../../../constants/icons";
import { SubmitHandler, useForm } from "react-hook-form";
import InputForm from "../../../../components/InputForm";
import { useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { toast } from "react-toastify";
import router from "next/router";
import { Formation } from "@prisma/client";
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
        email: session?.user?.email || "",
      },
      include: {
        etablissement: {
          include: {
            formations: {
              include: {
                versions: {
                  include: {
                    diplome: true,
                  },
                },
                diplome: true,
              },
            },
          },
        },
      },
    })
    .then((data) => JSON.parse(JSON.stringify(data)));
  const formations = utilisateur.etablissement.formations;
  const formation: Formation = formations.filter(
    (f: Formation) => f.intitule == context.query.formation
  )[0];
  return {
    props: {
      formation,
      etablissement: utilisateur.etablissement,

      ...(await serverSideTranslations(context.locale || "", ["common"])),
    },
  };
};
//TODO: added ability to choose template

export type InputsFormation = {

  intituleDiff: boolean;
  version: number;
  diplomeIntitule?: string;
  exp: boolean;
  annee?: number;
  mois?: number;
};
const FormationItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { isNew } = props;
  const { formation } = props;
  const lastVersion = formation.versions.at(-1)
  const { t } = useTranslation();
  const add = trpc.useMutation(["formation.new version"], {
    onSuccess: () => {
      toast.success(t("global.toast succes"));

      router.push("/workspace/formations/" + formation.intitule);

    },
    onError: (err) => {
      console.log(err);
      toast.error(t("global.toast erreur"));
    },
  });

  //React hook
  const {
    register,
    handleSubmit,
    watch,
    formState,
  } = useForm<InputsFormation>({
    defaultValues: {

      version: lastVersion.numero + 1,

    },
  });
  const { errors } = formState
  const onSubmit: SubmitHandler<InputsFormation> = (data) => {
   if( formState.isValid)
    add.mutate({ formation, more: { ...data, estVirtuel } })
    else{
      console.log(formState)
    }
  };

  ///
  const [estVirtuel, setestVirtuel] = useState(false);
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
          <div className="flex flex-row items-center justify-between px-1">
            <span className="label-text">{t("workspace.formation.version precedente")}
            </span>
            <div className="badge lg:badge-lg">{lastVersion.numero}</div>

          </div>
          <div className="divider" />
          <div

            className="flex flex-row justify-between items-center px-1"
          >
            <span className="label-text">
              {t("workspace.formation.nouvelle version")}
            </span>
            <InputForm
              type="number"
              register={register("version")}
              containerClass="w-[100px]"
              inputClass="input-sm text-center"
              error={watch('version') <= lastVersion.numero}
            />
          </div>

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
                  error={watch('intituleDiff') ? errors.diplomeIntitule : null}
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
                className="flex flex-wrap justify-between items-center px-1"
              >
                <span className="label-text">
                  {t("workspace.formation.duree de validite")}
                </span>

                <div className="flex flex-row items-center gap-2">
                  <InputForm
                    type="number"
                    register={register("annee")}
                    error={watch('exp') ? errors.annee : null}
                    placeholder={t("workspace.formation.annee")}
                    containerClass="w-[100px]"
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
                    type="number"
                    error={watch('exp') ? errors.mois : null}
                    placeholder={t("workspace.formation.mois")}
                    containerClass="w-[100px]"
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
            className={`btn btn-block btn-sm lg:btn-md ${add.isLoading && "loading"
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
