/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAutoAnimate } from "@formkit/auto-animate/react";
import {
  Contract,
  ContractMembre,
  Diplome,
  Etablissement,
  Formation,
  Version,
} from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import router from "next/router";
import React, { ReactNode, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AddIcon, DeleteIcon, SchoolIcon } from "../../../constants/icons";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";
import {prisma} from "../../../server/db/client"
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
  const id = context.query.contractId as string;
  // const utilisateur = JSON.parse(
  //   JSON.stringify(
  //     await prisma?.utilisateur.findUnique({
  //       where: {
  //         email: session.user?.email || "",
  //       },
  //     })
  //   )
  // );
  console.log(id);

  console.log("equal", id == "93c7a937-d916-412a-bd20-f2950d24ca16");
  const test = await prisma?.contract.findUniqueOrThrow({
    where: {
      id,
    },
  });
  console.log("test", test);

  const contract = JSON.parse(
    JSON.stringify(
      await prisma?.contract.findUnique({
        where: {
          id,
        },
        include: {
          membres: {
            include: {
              etablissement: {
                include: {
                  formations: {
                    include: {
                      diplome: true,
                      versions: {
                        include: {
                          diplome: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      })
    )
  );
  const utilisateur=JSON.parse(JSON.stringify(await prisma?.utilisateur.findUnique({
    where:{
      email:session.user?.email||""
    },
    include:{
      etablissement:true
          
       
    }})))
  console.log(contract);

  return {
    props: {
      id,
      contract,
      utilisateur,
      ...(await serverSideTranslations(context.locale||"", ["common"])),
    },
  };
};
type FullContract = Contract & {
  membres: Array<
    ContractMembre & {
      etablissement: Etablissement & {
        formations: Array<
          Formation & {
            versions: Array<Version & { diplome: Diplome }>;
            diplome: Diplome;
          }
        >;
      };
    }
  >;
};
const ContractItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  
  const [contract, setcontract] = useState<FullContract|undefined>()

  const [formations, setformationsX] = useState<Array<
  Formation & {
    versions: Array<Version & { diplome: Diplome }>;
    diplome: Diplome;
  }
>>([])
  useEffect(()=>{
    const t:FullContract=  props.contract;

    setcontract(t)
    setformations(t.conditionsId);
    setformationsX(t.membres
      .map((m) => m.etablissement.formations)
      .reduce((a, b) => [...a, ...b]))
    setAboutissement(t.aboutissementId)
  },[])

  const [step, setstep] = useState(2);
  const [open, setOpen] = React.useState(false);
  const text = (s: string) => t("workspace.relation." + s);
  const [selectedFormations, setformations] = useState<Array<string>>([]);
  const [selectedAboutissement, setAboutissement] = useState<string|null>();
  const [parent] = useAutoAnimate(/* optional config */);

  const {mutate,isLoading}=trpc.useMutation(['contract.finalisation'],{
    onError:(err)=>{
        console.log('err', err)
        toast.error('global.toast erreur')
    },
    onSuccess:()=>{
      toast.success('workspace.relation.finaliser')
       router.push("/workspace/relation")
       
    }
  })
 
  return (
    <Layout
      open={open}
      setOpen={setOpen}
      // data={layoutData().data}
      // selectedList={layoutData().selectedList}
      // onSelectedList={layoutData().onSelectedList}
      // oneValue={layoutData().oneValue}
      // subtitle={layoutData().subtitle}

      data={
        step == 2
          ? formations.map((f) => ({
              label: f.intitule,
              id: f.id,
              parentId: f.etablissementId,
            }))
          : formations
              .filter((f) => {
                const diplome = f.versionnage
                  ? f.versions[f.versions.length - 1]?.diplome
                  : f.diplome;
                return diplome?.estVirtuel;
              })
              .map((f) => ({
                label: f.intitule,
                id: f.id,
                parentId: f.etablissementId,
              }))
      }
      selectedList={
        step == 2
          ? selectedFormations
          : selectedAboutissement
          ? [selectedAboutissement]
          : []
      }
      oneValue={step == 2 ? false : true}
      onSelectedList={step == 2 ? setformations : setAboutissement}
      subtitle={contract?contract.membres.map((c) => ({
        label: c.etablissement.nom,
        id: c.etablissementId,
      })):[]}
    >
      <div className="flex justify-center items-center h-screen">
        <div className="w-[700px]  py-6 space-y-10">
          <p className="text-center py-3 px-2 bg-warning/20">
            {text(`step ${step} exp`)}
          </p>
          {step == 2 && <Steps2 t={t} />}
          {step == 3 && <Steps3 t={t} />}
          
          {step>=4 ? <Steps4 t={t} />:<>
         <div ref={parent as any} className="space-y-2  px-4">
            {(step == 2
              ? selectedFormations
              : step == 3
              ? selectedAboutissement
                ? [selectedAboutissement]
                : []
              : []
            ).map((_s, i) => {
              const e: Formation & { versions: Array<Version> } |undefined=
                formations.filter((f) => f.id == _s)[0];

              return (
                <div
                  key={i}
                  className="flex group flex-row gap-4 items-center bg-base-100 rounded-md p-2 border-[1px]"
                >
                  <div className="flex-grow space-y-3 px-2">
                    <h6>{e?.intitule}</h6>
                    {e?.versionnage ? (
                      <p className="badge badge-secondary">
                        {e?.versions[e.versions.length - 1]?.numero}
                      </p>
                    ) : (
                      <p></p>
                    )}
                  </div>

                  <div className="flex justify-center items-center p-2">
                    <button
                      onClick={() => {
                        setformations((old) => [
                          ...old.filter((o) => o != e?.id),
                        ]);
                      }}
                      className="opacity-0 group-hover:opacity-100 btn btn-error btn-sm"
                    >
                      <DeleteIcon className="text-lg " />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex flex-row justify-center  px-4">
            <button
              onClick={() => setOpen(true)}
              className="btn  gap-2 btn-outline btn-sm"
            >
              <AddIcon className="icon" />
              {text("ajouter formation")}
            </button>
          </div>
         </>}
          <div className="divider  px-2"></div>
          <div className="flex flex-row justify-between items-center  px-2">
            <button
              onClick={() => {
                if (step <= 2) {
                  router.back();
                } else {
                  setstep(step - 1);
                }
              }}
              className="btn btn-ghost"
            >
              {t("global.retour")}
            </button>
            <button
            disabled={step==4?(!selectedAboutissement&&selectedFormations.length==0):false}
              onClick={
                () => {
                  if(step>=4){
               mutate({
                formations:selectedFormations,
                aboutissement:selectedAboutissement as string,
                id:contract?.id||"",
                membreId:contract?.membres.filter((c)=>c.etablissementId==props.utilisateur.etablissementId)[0]?.id||""
               })
                  }else{
                    setstep(step + 1)
                  }
                }
              
              }
              className={`btn btn-primary ${isLoading&&"loading"} ${step<=3&&"btn-outline"}`}
            >
              {step==4?t('inscription.valider'): t("global.suivant")}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const Steps2 = ({ t }: { t: any }) => {
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <ul className="steps w-full">
      <li className="step step-primary text-primary">{text("step 1")}</li>
      <li className="step step-primary text-primary">{text("step 2")}</li>
      <li className="step">{text("step 3")}</li>
      <li className="step">{text("step 4")}</li>
    </ul>
  );
};
const Steps3 = ({ t }: { t: any }) => {
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <ul className="steps w-full">
      <li className="step step-primary text-primary">{text("step 1")}</li>
      <li className="step step-primary text-primary">{text("step 2")}</li>
      <li className="step step-primary text-primary">{text("step 3")}</li>
      <li className="step">{text("step 4")}</li>
    </ul>
  );
};

const Steps4 = ({ t }: { t: any }) => {
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <ul className="steps w-full">
      <li className="step step-primary text-primary">{text("step 1")}</li>
      <li className="step step-primary text-primary">{text("step 2")}</li>
      <li className="step step-primary text-primary">{text("step 3")}</li>
      <li className="step step-primary text-primary">{text("step 4")}</li>
    </ul>
  );
};

type LayoutProps = {
  open: boolean;
  setOpen: (s:boolean)=>void;
  data: Array<{
    label: string;
    id: string;
    parentId: string;
  }>;
  oneValue?: boolean;
  selectedList: Array<string>;
  onSelectedList: (s:any)=>void;
  subtitle?: Array<{
    label: string;
    id: string;
  }>;
};
const Layout = ({
  children,
  open,
  setOpen,
  data,
  oneValue,
  selectedList,
  onSelectedList,
  subtitle,
}: LayoutProps & {
  children: ReactNode;
}) => {

  return (
    <div className="drawer drawer-end">
      <input
        id="my-drawer"
        type="checkbox"
        checked={open}
        onChange={(e) => setOpen(e.target.checked)}
        className="drawer-toggle"
      />
      <div className="drawer-content">{children}</div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <div className="bg-base-100 h-screen p-4">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered w-full"
          />
          <div className="py-4"></div>
          <ul className="menu  overflow-y-auto w-80  text-base-content">
            {data.map((e, i) => {
              const checked = selectedList.includes(e.id);
              return (
                <li
                  onClick={() => {
                    if (oneValue) {
                      onSelectedList(e.id);
                    } else {
                      if (checked) {
                        onSelectedList((old: Array<string>) => [
                          ...old.filter((o) => o != e.id),
                        ]);
                      } else {
                        onSelectedList((old: Array<string>) => [...old, e.id]);
                      }
                    }
                    setOpen(false);
                  }}
                  key={i}
                >
                  <div className={`flex flex-row gap-4`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      className="checkbox"
                    />
                    <p>
                      {e.label}
                      {subtitle && (
                        <p className="label-text text-[10px] italic flex flex-row gap-1 items-center">
                          <SchoolIcon />{" "}
                          {subtitle.filter((s) => s.id == e.parentId)[0]?.label}
                        </p>
                      )}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ContractItem;
