/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Etablissement } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { ReactNode } from "react";
import { useState } from "react";

import { AddIcon,  DeleteIcon } from "../../constants/icons";
import { authOptions } from "../api/auth/[...nextauth]";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import router from "next/router";
import { trpc } from "../../utils/trpc";
import { toast } from "react-toastify";
import {prisma} from "../../server/db/client"
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
  const utilisateur = JSON.parse(
    JSON.stringify(
      await prisma?.utilisateur.findUnique({
        where: {
          email: session.user?.email || "",
        },
      })
    )
  );
  const etablissements = JSON.parse(
    JSON.stringify(await prisma?.etablissement.findMany({where:{
       NOT:{
        logo:null
       }
    }}))
  );
  return {
    props: {
      etablissements,
      etablissementId: utilisateur.etablissementId,
      ...(await serverSideTranslations(context.locale||"", ["common"])),
    },
  };
};
const Contract = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const { etablissementId, etablissements } = props;
  const [open, setOpen] = React.useState(false);
  const text = (s: string) => t("workspace.relation." + s);
  const [partenaires, setpartenaires] = useState([]);
  const getEta = (s: string) => etablissements.filter((p: any) => p.id == s)[0];
  const [parent] = useAutoAnimate(/* optional config */);
  const {mutate,isLoading}=trpc.useMutation(['contract.new contract'],{
    onError:(err)=>{
     console.log('err', err)
     toast.error('global.toast erreur')
    },
    onSuccess:(data)=>{
        if(data.etape!=1){
            router.replace("/contract/"+data.id)
        }else{
            toast(t('workspace.relation.init'))
            router.push("/workspace/relation")
        }
    }
  })
  return (
    <Layout
      open={open}
      setOpen={setOpen}
      etablissements={etablissements}
      partenaires={[...partenaires, etablissementId]}
      setpartenaires={setpartenaires}
    >
      <div className="flex justify-center items-center h-screen">
        <div className="w-[700px]  py-6 space-y-10">
          <p className="text-center py-3 px-2 bg-warning/20">
            {text("step 1 exp")}
          </p>
          <Steps t={t} />
          <div ref={parent as any} className="space-y-2  px-4">
            {[etablissementId, ...partenaires].map((et, i) => {
              const e: Etablissement = getEta(et);
              const isMine = e.id == etablissementId;
              return (
                <div
                  key={i}
                  className="flex group flex-row gap-4 items-center bg-base-100 rounded-md p-2 border-[1px]"
                >
                  <div className="min-w-[70px] max-w-[70px]">
                    <img src={e.logo!} alt="logo" className="object-cover" />
                  </div>

                  <div className="flex-grow">
                    <h6>{e.abrev}</h6>
                    <p>{e.nom}</p>
                  </div>
                  {isMine || (
                    <div className="flex justify-center items-center p-2">
                      <button
                        onClick={() => {
                          setpartenaires((old) => [
                            ...old.filter((o) => o != e.id),
                          ]);
                        }}
                        className="hidden group-hover:block btn btn-error btn-sm"
                      >
                        <DeleteIcon className="text-lg " />
                      </button>
                    </div>
                  )}
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
              {text("ajouter")}
            </button>
          </div>
          <div className="divider  px-2"></div>
          <div className="flex flex-row justify-between items-center  px-2">
            <button onClick={()=>{
                router.back()
            }} className="btn btn-ghost">{t("global.retour")}</button>
            <button onClick={()=>{
              mutate({
                membres:[etablissementId,...partenaires].map((e)=>({
                    etablissementId:e,
                    accept:e==etablissementId?true:false,
                    
                })),
                etablissements
            })
            }} className={`btn btn-primary ${isLoading&& "loading"}`}>{t("global.suivant")}</button>
          </div>
        </div>
      </div>
    </Layout>
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

type LayoutProps = {
  children: ReactNode;
  open: boolean;
  setOpen: (s:boolean)=>void;
  etablissements: Array<Etablissement>;
  partenaires: Array<string>;
  setpartenaires: (s:any)=>void;
};
const Layout = ({
  children,
  open,
  setOpen,
  etablissements,
  partenaires,
  setpartenaires,
}: LayoutProps) => {

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
            {etablissements.map((e, i) => {
              const checked = partenaires.includes(e.id);
              return (
                <li
                  onClick={() => {
                    if (checked) {
                      setpartenaires((old: Array<string>) => [
                        ...old.filter((o) => o != e.id),
                      ]);
                    } else {
                      setpartenaires((old: Array<string>) => [...old, e.id]);
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
                    <p>{e.nom}</p>
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

export default Contract;
