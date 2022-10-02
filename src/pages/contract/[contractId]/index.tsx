import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Etablissement } from "@prisma/client";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import router from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { AddIcon, DeleteIcon } from "../../../constants/icons";
import Etape1 from "../../../partials/contract/Etape1";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";

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
    const id=context.query.contractId as string
    // const utilisateur = JSON.parse(
    //   JSON.stringify(
    //     await prisma?.utilisateur.findUnique({
    //       where: {
    //         email: session.user?.email || "",
    //       },
    //     })
    //   )
    // );
    const contract = JSON.parse(
      JSON.stringify(await prisma?.etablissement.findMany(
        {
            where:{
                id
            },
            include:{
                membres:{
                    include:{
                        etablissement:{
                            include:{
                                formations:{
                                    include:{
                                        versions:true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
      ))
    );
    return {
      props: {
        contract,
        etape:contract.etape,
        ...(await serverSideTranslations(context.locale!, ["common"])),
      },
    };
  };
  const ContractItem = (
    props: InferGetServerSidePropsType<typeof getServerSideProps>
  ) => {
    const { t } = useTranslation();
    const { contract,etape } = props;
    const [step, setstep] = useState(etape)
    const text = (s: string) => t("workspace.relation." + s);
    const [partenaires, setpartenaires] = useState([]);
    const [parent] = useAutoAnimate(/* optional config */);
    const {}=trpc.useMutation(['contract.new contract'],{
      onError:(err)=>{
       console.log('err', err)
       toast.error('global.toast erreur')
      },
      onSuccess:(data)=>{
          if(data.etape!=1){
              router.replace("/contract/"+data.id)
          }else{
              toast('workspace.relation.init')
              router.push("/workspace/relation")
          }
      }
    })
    return (
   
        <div className="flex justify-center items-center h-screen">
          <div className="w-[700px]  py-6 space-y-10">
            {/* <p className="text-center py-3 px-2 bg-warning/20">
              {text("step 1 exp")}
            </p>
            <Steps t={t} /> */}
            
           {etape==2&& <Etape1/>}
            
            <div className="divider  px-2"></div>
            <div className="flex flex-row justify-between items-center  px-2">
              <button onClick={()=>{
                  router.back()
              }} className="btn btn-ghost">{t("global.retour")}</button>
              <button className="btn btn-primary">{t("inscription.valider")}</button>
            </div>
          </div>
        </div>
  
    );
  };
  


  export default ContractItem