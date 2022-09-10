import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../../api/auth/[...nextauth]";
import Workspace from "../../../../components/Workspace";
import { prisma } from "../../../../server/db/client";
import { useTranslation } from "next-i18next";
import { AddFileIcon, AddIcon, DeleteIcon } from "../../../../constants/icons";
import { Diplome, Formation, Version } from "@prisma/client";
import { useForm } from "react-hook-form";
import InputForm, { TextAreaForm } from "../../../../components/InputForm";
import { motion } from "framer-motion";
import { useMyTransition } from "../../../../utils/hooks";
import { useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { toast } from "react-toastify";
import router from "next/router";
import { DialogConfirmation } from "../../../../components/Dialog";
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
let formation: Formation = formations.filter(
    (f: Formation) => f.intitule == context.query.formation
  )[0]
  formation={...formation,versions:formation.versions.sort((a,b)=>a.numero-b.numero)};

  // const formation

  return {
    props: {
      etablissement: utilisateur.etablissement,
      formation,
      ...(await serverSideTranslations(context.locale || "", ["common"])),
    },
  };
};
//TODO: added ability to choose template
type FormationUpdate = {
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
  const { formation } = props;
  const diplome: Diplome = !formation.versionnage
    ? formation.diplome
    : formation.versions.at(-1).diplome;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormationUpdate>({
    defaultValues: {
      intitule: formation.intitule,
      version: formation.numero,
      intituleDiff: diplome.intituleDiff,
      diplomeIntitule: diplome.intitule || undefined,
      exp: diplome.expiration,
      annee: diplome.dureeExpiration
        ? parseInt((diplome.dureeExpiration / 12).toString())
        : undefined,
      mois: diplome.dureeExpiration ? diplome.dureeExpiration % 12 : undefined,
    },
  });
  const { t } = useTranslation();
  const deleteFormation = trpc.useMutation(["formation.delete"], {
    onSuccess: (data) => {
      toast.success(t("global.toast succes"));
      router.back();
    },
    onError: (err) => {
      console.log(err);
      toast.error(t("global.toast erreur"));
    },
  });

  const update = trpc.useMutation(["formation.update title"], {
    onSuccess: (data) => {
      toast.success(t("global.toast succes"));

      router.replace(data.intitule);
    },
    onError: (err) => {
      console.log(err);
      toast.error(t("global.toast erreur"));
    },
  });

  const onSubmit = (data: FormationUpdate) =>
    update.mutate({
      id: formation.id,
      intitule: data.intitule,
    });
  const { controls: animationSubmit } = useMyTransition({
    trigger: watch("intitule") != formation.intitule,
    direction: "right",
  });
//TODO: fix date format
  const dateString = (date: string) => {
    const d = new Date(date);
    return d.getDate() + "-" + d.getMonth() + "-" + d.getFullYear();
  };
  const [estVirtuel, setestVirtuel] = useState(false);
  const { controls: ctl2 } = useMyTransition({
    trigger: watch("intituleDiff"),
  });
  const { controls: ctl3 } = useMyTransition({ trigger: watch("exp") });
  const { controls: ctl4 } = useMyTransition({ trigger: estVirtuel });
  const versions = formation.versions;


  return (
    <>
      <Workspace>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-3 md:px-6 flex flex-row max-w-[700px] mx-auto"
        >
          <div className="flex-grow space-y-6">
            {formation.versionnage && (
              <>
                <div className="flex flex-row justify-end items-center">
                  {/* <h6>{t("workspace.formation.versions")}</h6> */}
                  <span
                    onClick={() => {
                      router.push("/workspace/formations/" + formation.intitule + "/version")
                    }}
                    className="btn btn-outline btn-sm btn-secondary gap-2"
                  >
                    <AddIcon />
                    {t("workspace.formation.nouvelle version")}
                  </span>
                </div>

                <div className="stack w-full text-white">
                  {versions.reverse().map((f: Version, i: number) => {
                    console.log((new Date(f.createAt)).getDate())
                    return (
                      <div
                        key={f + i.toString()}
                        className={`w-full h-20 rounded ${i == 0
                          ? "bg-primary"
                          : i == 1
                            ? "bg-accent"
                            : "bg-secondary"
                          }   p-4 flex flex-col justify-between`}
                      >
                        <h6>({f.numero})</h6>
                        <p className="text-right text-[12px] italic opacity-70">
                          {dateString(f.createAt.toString())}

                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            <TextAreaForm
              register={register("intitule", {
                required: true,
              })}
              label={t("workspace.formation.intitule")}
              placeholder={t("workspace.formation.saisir")}
              error={errors.intitule}
            />

            <div className="card  bg-base-100 shadow-xl border-[1px]">
              <div className="card-body">
                <h2 className="card-title">
                  {t("global.diplome/attestation")}
                </h2>
                <InputForm
                  register={register("intituleDiff")}
                  label={t("workspace.formation.meme intitule")}
                  error={errors.intituleDiff}
                  props={{
                    disabled: true,
                  }}
                  toggle
                />
                <motion.div animate={ctl2}>
                  <InputForm
                    register={register("diplomeIntitule")}
                    error={errors.intitule}
                    props={{
                      disabled: true,
                    }}
                    inputClass="input-sm"
                  />
                </motion.div>
                <InputForm
                  register={register("exp")}
                  props={{
                    disabled: true,
                  }}
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
                      props={{
                        disabled: true,
                      }}
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
                      props={{
                        disabled: true,
                      }}
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
                      disabled
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
                      disabled
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

            <div className="flex flex-row justify-between items-center">
              <DialogConfirmation onClick={() => deleteFormation.mutate(formation.id)} classButton="btn btn-sm lg:btn-md btn-error gap-2 lg:gap-3">
                <DeleteIcon className={`lg:text-2xl ${deleteFormation.isLoading && "loading"}`} />
                {t("workspace.formation.suppression")}
              </DialogConfirmation>
              <motion.button
                animate={animationSubmit}
                type="submit"
                className="btn btn-sm lg:btn-md gap-2 lg:gap-3"
              >
                {t("global.enregistrer")}
              </motion.button>
            </div>
          </div>
        </form>
        <div className="py-4 lg:py-6" />
      </Workspace>
    </>
  );
};

export default FormationItem;
