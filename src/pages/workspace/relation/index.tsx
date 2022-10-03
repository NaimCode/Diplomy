import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import {
  AddIcon,
  ArrayRightIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  CloseIcon,
} from "../../../constants/icons";
import VoirPlus from "../../../components/VoidPlus";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useMyTransition } from "../../../utils/hooks";
import router from "next/router";
import { Contract, ContractMembre, Etablissement } from "@prisma/client";
import { toast } from "react-toastify";
import { trpc } from "../../../utils/trpc";

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
        include: {
          etablissement: {
            include: {
              contracts: {
                include: {
                  Contract: {
                    include: {
                      membres: {
                    
                        include: {
                          etablissement: true,
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
  return {
    props: {
      utilisateur,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

type FullEtablissement = Etablissement & {
  contracts: Array<
    ContractMembre & {
      Contract: Contract & {
        membres: Array<ContractMembre & { etablissement: Etablissement }>;
      };
    }
  >;
};
const Relation = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.relation." + s);
  const etablissement: FullEtablissement = props.utilisateur.etablissement;
  const { contracts } = etablissement;
  return (
    <>
      <Workspace>
        <div className="p-6">
          <div className="flex flex-row justify-between items-center">
            <h3>{text("mes contrats")}</h3>
            <button
              onClick={() => {
                router.push("/contract");
              }}
              className="btn btn-primary gap-2"
            >
              <AddIcon className="icon" />
              {t("global.ajouter")}
            </button>
          </div>
          <div className="py-6">
            {contracts.map((f=>f.Contract)).map((c, i) => {
              return (
                <button
                  onClick={() => {
                    router.push("/contract/" + c.id);
                  }}
                  key={i}
                  className="rounded-lg border-[1px] h-[100px] w-full"
                >
                  {c.createAt.toString()}
                </button>
              );
            })}
          </div>
        </div>
        <PartenaireSection etablissementId={etablissement.id}/>
      </Workspace>
    </>
  );
};


const PartenaireSection = ({etablissementId}:{etablissementId:string}) => {
  const [up, setup] = useState(false);
  const controls = useAnimationControls();
  const [demande, setdemande] = useState<
    Array<
      Contract & {
        membres: Array<ContractMembre & { etablissement: Etablissement }>;
      }
    >
  >([]);

  const getDemande = trpc.useQuery(["contract.demandes"], {
    onSuccess(data) {
      setdemande(data);
    },
  });

  useEffect(() => {
    if (up) {
      controls.start({
        opacity: 1,

        height: 700,
      });
    } else {
      controls.start({
        opacity: 0,

        height: 0,
      });
    }
  }, [up]);
  const { t } = useTranslation();
  const {mutate,isLoading}=trpc.useMutation('contract.demande action',{
    onError:(err)=>{
    console.log('err', err)
    toast.error(t('global.toast erreur'))
    },
    onSuccess:(data)=>{
      getDemande.refetch()
      toast.success(t('global.toast succes'))
    }
  })
  return (
    <div className="absolute bottom-5 right-5 max-h-[70%] w-[300px] bg-base-200 rounded-lg flex flex-col drop-shadow-md">
      <div
        onClick={() => setup(!up)}
        className="btn btn-primary flex flex-row justify-between items-center shadow-sm"
      >
        <h6 className="flex items-center flex-row gap-2">{t("workspace.relation.demande")} <div className="badge badge-success">{demande.length}</div></h6>

        {up ? (
          <ArrowDownIcon className="swap-on icon" />
        ) : (
          <ArrowUpIcon className="swap-off icon" />
        )}
      </div>
      <motion.div animate={controls}>
        <div className="flex flex-col gap-3 p-2">
          {demande.length == 0 ? (
            <div></div>
          ) : (
            demande.map((d, i) => {
              return (
                <div
                  key={i}
                  className="bg-base-100 p-2 w-full rounded-md space-y-2 relative group"
                >
                  <div className="hidden group-hover:flex flex-col w-full h-full absolute top-0 left-0 bg-base-100/30 backdrop-blur-sm justify-center items-center gap-3">
                    <button onClick={()=>{
                      mutate({
                        id:d.id,
                        idMembre:d.membres.filter(f=>f.etablissementId==etablissementId)[0]?.id!,
                        action:'refuse'
                      })
                    }} className={`btn btn-ghost btn-sm gap-2  ${isLoading &&'loading'}`}>
                      <CloseIcon className="text-lg"/>
                      {t('workspace.relation.refuser')}
                    </button>
                   
                    <button 
                    onClick={()=>{
                      mutate({
                        id:d.id,
                        idMembre:d.membres.filter(f=>f.etablissementId==etablissementId)[0]?.id!,
                        action:'accept'
                      })
                    }}
                    className={`btn btn-sm gap-2 ${isLoading &&'loading'}`}>
                      <CheckIcon className="text-lg"/>
                      {t('workspace.relation.accepter')}
                    </button>
                  </div>
                  <p className="text-[10px] italic">
                    {t("workspace.relation.entre")}
                  </p>
                  {d.membres.map((m, i) => (
                    <div key={i} className="flex flex-row gap-2 items-center">
                      <div className="min-w-[40px] max-w-[40px]">
                        <img
                          src={m.etablissement.logo!}
                          className="object-cover"
                        />
                      </div>

                      <p className="label-text">
                        {m.etablissement.nom} <b>({m.etablissement.abrev})</b>
                      </p>
                    </div>
                  ))}
                </div>
              );
            })
          )}
        </div>
      </motion.div>

      <motion.div animate={controls} className="mx-auto"></motion.div>
    </div>
  );
};
export default Relation;
