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
  RadioActiveIcon,
  RadioDisabledIcon,
} from "../../../constants/icons";
import VoirPlus from "../../../components/VoidPlus";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useHasMetaMask, useLocale, useMyTransition } from "../../../utils/hooks";
import router from "next/router";
import {
  Contract,
  ContractMembre,
  Etablissement,
  Utilisateur,
} from "@prisma/client";
import { toast } from "react-toastify";
import { trpc } from "../../../utils/trpc";
import { DialogOk } from "../../../components/Dialog";
import { DialogNoMetaMask } from "../../../partials/etudiants/Attente";

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

  const [contracts, utilisateur] = (await prisma?.$transaction([
    prisma.contract.findMany({
      where: {
        membres: {
          every: {
            accept: true,
          },
          some: {
            etablissement: {
              membresAutorises: {
                has: session.user?.email || "",
              },
            },
          },
        },
      },
      include: {
        membres: {
          include: {
            etablissement: true,
          },
        },
      },
    }),
    prisma.utilisateur.findUnique({
      where: {
        email: session.user?.email || "",
      },
      include: {
        etablissement: true,
      },
    }),
  ])) as [
    Contract[],
    Utilisateur & {
      etablissement: Etablissement;
    }
  ];
  return {
    props: {
      utilisateur: JSON.parse(JSON.stringify(utilisateur)),
      contracts: JSON.parse(JSON.stringify(contracts)),
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
  const contracts: Array<
    Contract & {
      membres: Array<ContractMembre & { etablissement: Etablissement }>;
    }
  > = props.contracts;

  const getStatus = (
    c: Contract & {
      membres: Array<ContractMembre & { etablissement: Etablissement }>;
    }
  ): "incomplet" | "finalisation" | "signer" => {
    if (c.aboutissementId && c.conditionsId.length >= 1) {
      if (c.membres.every((m) => m.confirm == true)) {
        return "signer";
      } else {
        return "finalisation";
      }
    }
    return "incomplet";
  };
  const [incompletDialog, setincompletDialog] = useState(false)
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
          <div className="py-6 space-y-4">
            {contracts.map((c, i) => {
              const status = getStatus(c);

              const badge =
                status == "finalisation"
                  ? "badge-secondary"
                  : status == "signer"
                  ? "badge-primary"
                  : "";
              
                  const border =
                  status == "finalisation"
                    ? "border-secondary"
                    : status == "signer"
                    ? "border-primary"
                    : "border-base-200";
              //TODO: date to locale
              const date = new Date(c.createAt.toString()).toLocaleDateString();
           
              return (
                <div
                  onClick={() => {
                    if(status=='incomplet'){
                    //  setincompletDialog(true)
                      router.push("/contract/" + c.id);
                    }
                    if(status=='finalisation'){
                      router.push("/contract/" + c.id+"/confirmation");
                    }
                    if(status=='signer'){
                      if((window as any).ethereum){
                            router.push("/certifier/contract/"+c.id)
                      }else{
                       const link=document.createElement('a')
                       link.href='#no_meta_mask'
                        link.click()
                      }
                    }
                  
                  }}
                  key={i}
                  className={`p-5  w-full  rounded-lg cursor-pointer hover:shadow-md transition-all duration-300 bg-base-200`}
                >
                  <p className={`badge ${badge}`}>
                    {t("workspace.relation.status " + status)}
                  </p>
                  <p className="text-[10px] italic">
                    {t("workspace.relation.entre")}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {c.membres.map((m, i) => (
                      <div
                        key={i}
                        className="w-full lg:w-[350px] flex flex-row items-center gap-2  p-1 "
                      >
                        <div className="min-w-[50px] max-w-[50px] object-center">
                          <img
                            src={m.etablissement.logo!}
                            alt="logo"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p>{m.etablissement.nom}</p>
                          <h6>{m.etablissement.abrev}</h6>
                         {status!='incomplet'&& <p className={`flex flex-row gap-3 items-center ${m.confirm?"text-primary":"opacity-40"}`}>{m.confirm?<RadioActiveIcon/>:<RadioDisabledIcon/>} {m.confirm?text('confirme'):text('en attente')}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex justify-end">
                    <p className="label-text text-[12px] opacity-40"> {date}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      <PartenaireSection etablissementId={etablissement.id} />
      </Workspace>
      <DialogOk open={incompletDialog} setOpen={setincompletDialog} text="workspace.relation.dialog incomplet"/>
     <DialogNoMetaMask/>
    </>
  );
};

const PartenaireSection = ({
  etablissementId,
}: {
  etablissementId: string;
}) => {
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
  const { mutate, isLoading } = trpc.useMutation("contract.demande action", {
    onError: (err) => {
      console.log("err", err);
      toast.error(t("global.toast erreur"));
    },
    onSuccess: (data) => {
      getDemande.refetch();
      if (data == "accept")
        toast.success(t("workspace.relation.toast accepter"));
      else {
        toast.success(t("workspace.relation.toast refuser"));
      }
    },
  });
  const {isAr}=useLocale()
  return (
    <div className={`fixed bottom-5  ${isAr?"left-5":"right-5"} max-h-[70%] w-[300px] bg-base-200 rounded-lg flex flex-col drop-shadow-lg  overflow-scroll`}>
      <div
        onClick={() => setup(!up)}
        className="btn btn-primary flex flex-row justify-between items-center shadow-sm"
      >
        <h6 className="flex items-center flex-row gap-2">
          {t("workspace.relation.demande")}{" "}
          {getDemande.isLoading ? (
            <button className="btn loading btn-ghost"></button>
          ) : (
            <div className="badge badge-success">{demande.length}</div>
          )}{" "}
        </h6>

        {up ? (
          <ArrowDownIcon className="swap-on icon" />
        ) : (
          <ArrowUpIcon className="swap-off icon" />
        )}
      </div>

      <motion.div animate={controls} className="">
        <div className="flex flex-col gap-3 p-2 ">
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
                    <button
                      onClick={() => {
                        mutate({
                          id: d.id,
                          idMembre: d.membres.filter(
                            (f) => f.etablissementId == etablissementId
                          )[0]?.id!,
                          action: "refuse",
                        });
                      }}
                      className={`btn btn-ghost btn-sm gap-2  ${
                        isLoading && "loading"
                      }`}
                    >
                      <CloseIcon className="text-lg" />
                      {t("workspace.relation.refuser")}
                    </button>

                    <button
                      onClick={() => {
                        mutate({
                          id: d.id,
                          idMembre: d.membres.filter(
                            (f) => f.etablissementId == etablissementId
                          )[0]?.id!,
                          action: "accept",
                        });
                      }}
                      className={`btn btn-sm gap-2 ${isLoading && "loading"}`}
                    >
                      <CheckIcon className="text-lg" />
                      {t("workspace.relation.accepter")}
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
