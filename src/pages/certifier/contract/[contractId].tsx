import {
  Diplome,
  Etablissement,
  Etudiant,
  Formation,
  Version,
} from "@prisma/client";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import router from "next/router";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { toast } from "react-toastify";

import MyLottie from "../../../components/MyLottie";
import {
  BackIcon,
  PersonIcon,
  EmailIcon,
  DiplomaIcon,
  CopyIcon,
  CodeQRIcon,
} from "../../../constants/icons";
import { env } from "../../../env/client.mjs";
import {
  useMyTheme,
  useMyTransition,
  useQR,
  GATEWAY_IPFS,
} from "../../../utils/hooks";
import { trpc } from "../../../utils/trpc";
import { useWeb3Connection } from "../../../utils/web3";
import { authOptions } from "../../api/auth/[...nextauth]";
import { Loading, Message } from "../[etudiantId]";
import animationData from "../../../../public/lotties/ether_loading.json";
import animationData2 from "../../../../public/lotties/checkout.json";
import bravoAnimation from "../../../../public/lotties/bravo.json";
import checkAnimation from "../../../../public/lotties/check.json";
import { MContract, MFormation } from "../../../models/types";
import { FormationItem } from "../../contract/[contractId]/confirmation";
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  const id = context.query.contractId as string;
  const contract: MContract = await prisma?.contract
    .findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        aboutissement: {
          include:{
            etablissement:true
          }
        },
        membres: {
          include: {
            etablissement: true,
          },
        },
      },
    })

    .then((data) => JSON.parse(JSON.stringify(data)));

  const formations = await prisma?.formation
    .findMany({
      where: {
        id: {
          in: contract.conditionsId,
        },
      },
      include: {
        etablissement: true,
      },
    })
    .then((data) => JSON.parse(JSON.stringify(data)));
  return {
    props: {
      contract,
      formations,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

type FullEtudiantType = Etudiant & {
  document: Document;
  etablissement: Etablissement;
  formation: Formation & {
    versions: Array<Version & { diplome: Diplome }>;
    diplome: Diplome;
  };
};
const Certifier = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const web3 = useWeb3Connection();
  const [isWeb3Loading, setisWeb3Loading] = useState(false);
  const [transactionDone, settransactionDone] = useState<any | undefined>();
  const contract: MContract = props.contract;
  const formations: Array<MFormation> = props.formations;
  const { controls } = useMyTransition({
    trigger: web3.active && !web3.isLoading,
  });
  const { t } = useTranslation();

  type CertificationProps = {
    intitule: string;
    documentHash: string;
    nom: string;
    etablissementHash: string;
    prenom: string;
    expiration: string;
    type: string;
    version: string;
  };
  //test

  function addMonths(numOfMonths: number, date = new Date()) {
    date.setMonth(date.getMonth() + numOfMonths);
    console.log("toLocaleDateString", date.toLocaleDateString());

    return date.toLocaleDateString();
  }
  // const getInfoForContract = (e: FullEtudiantType): CertificationProps => {
  //   const documentHash = e.document.hash;
  //   const nom = e.nom;
  //   const prenom = e.prenom;
  //   const etablissementHash = e.etablissemntId;
  //   //
  //   const formation = e.formation;
  //   const versions = formation.versions;
  //   const intitule =
  //     formation.versionnage &&
  //     versions[versions.length - 1]?.diplome.intituleDiff
  //       ? versions[versions.length - 1]?.diplome.intitule!
  //       : formation.intitule;

  //   const version = formation.versionnage
  //     ? versions[versions.length - 1]?.numero.toString()!
  //     : "";

  //   console.log("formation.versions[-1]", formation.versions[-1]);
  //   const diplome: Diplome = formation.versionnage
  //     ? versions[versions.length - 1]?.diplome!
  //     : formation.diplome;
  //   console.log("diplome", diplome);

  //   //TODO: change type according to language
  //   const type = diplome.estVirtuel ? "Virtuel" : "Physique";
  //   const months = diplome.expiration ? diplome.dureeExpiration : undefined;

  //   const expiration = months ? addMonths(months) : "";
  //   return {
  //     intitule,
  //     etablissementHash,
  //     nom,
  //     prenom,
  //     version,
  //     documentHash,
  //     type,
  //     expiration,
  //   };
  // };

  // const onSign = async () => {
  //   //TODO: auto convertion
  //   const provider = new ethers.providers.Web3Provider(
  //     (window as any).ethereum
  //   );
  //    console.log('price', env.NEXT_PUBLIC_PRICE)
  //   const contract = new ethers.Contract(
  //     ethers.utils.getAddress("0xC70a55F912b25092b552Dd488C16fD8d7929cf2e"),
  //     CertificationAbi.abi,
  //     web3.provider
  //   );
  //   const signer = web3.provider!.getSigner();
  //   if (!signer) {
  //     toast.error(t("web3.rejeter"));
  //   } else {
  //     const contractSigner = contract.connect(signer);
  //     let hash=undefined;
  //     const info = getInfoForContract(etudiant);
  //     console.log(info);

  //     setisWeb3Loading(true);

  //     try {
  //       hash = await contractSigner.NouveauDiplome(
  //         info.intitule,
  //         info.documentHash,
  //         info.nom,
  //         info.etablissementHash,
  //         info.prenom,
  //         info.version,
  //         info.expiration,
  //         info.type,
  //         ethers.utils.getAddress(web3.account!),
  //         {value:env.NEXT_PUBLIC_PRICE}
  //       );
  //   certifier({
  //     transaction:{
  //       hash:hash.hash,
  //       blockNumber:hash.blockNumber,
  //       blockHash:hash.blockHash,
  //       signataire:hash.from,
  //       type:"CERTIFICATION",
  //       chainId:hash.chainId
  //     },

  //     etudiant:etudiant,
  //     codeQR:qr.generate(hash.hash,160)
  //   })
  //     } catch (error:any) {
  //       if(error.code= -32000){
  //         console.log("error", error);
  //         toast.error(t("web3.montant insuffisant"));
  //         setisWeb3Loading(false)
  //       }else{
  //         console.log("error", error);
  //         toast.error(t("global.toast erreur"));
  //         setisWeb3Loading(false)
  //       }

  //     }

  //   }
  // };

  // if(transactionDone){
  //   return <div></div>
  // }
  const qr = useQR();

  const toClipboard = (data: string) => {
    navigator.clipboard.writeText(data);
    toast.success(t("global.text copie"));
  };
  const { mutate: certifier } = trpc.useMutation(["transaction.certifier"], {
    onError: (err) => {
      console.log("error", err);
      toast.error(t("global.toast erreur"));
      setisWeb3Loading(false);
    },
    onSuccess: (data) => {
      settransactionDone(data);
      setisWeb3Loading(false);
    },
  });
  if (web3.isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-screen h-screen bg-base-100 flex justify-center">
      <div className="flex w-full flex-col gap-2 max-w-2xl p-5 lg:p-2 h-[300px]">
        <div>
          {" "}
          <button
            onClick={() => {
              router.back();
            }}
            className="btn btn-ghost gap-3"
          >
            <BackIcon className="text-lg" />
            {t("global.retour")}
          </button>
        </div>
        <div>
          <MyLottie animationData={animationData2} />
        </div>
        <Message web3={web3} />
        <motion.div animate={controls}>
          <h6 className="my-3">{t("workspace.relation.partenariats")}</h6>
          {contract.membres.map((m, i) => (
            <div
              key={i}
              className="w-full flex flex-row items-center gap-2  p-1 border border-base-200 my-2 rounded-md"
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
              </div>
            </div>
          ))}

          <div className="divider">
           
            </div>
            <div>
              <h6 className="my-3">{t("workspace.relation.step 2")}</h6>

              {formations.map((m, i) => (
                <FormationItem item={m}  classCard="rounded-md"/>
              ))}
          </div>
          <div className="divider">
        
           </div>
           <h6 className="my-3">{t("workspace.relation.step 3")}</h6>
           <FormationItem item={contract.aboutissement} classCard="text-primary rounded-md"/>
           <div className="divider">
        
        </div>
           <div className="flex items-center justify-center">
            <button
              onClick={() => {
                //onVallid
              }}
              className={`btn btn-primary btn-wide ${
                isWeb3Loading && "loading"
              }`}
            >
              {t("global.dialog validate")}
            </button>
          </div>
           <div className="py-10"></div>
        </motion.div>
      </div>

      {transactionDone && (
        <div className="modal modal-open bg-base-200">
          <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
            <MyLottie animationData={bravoAnimation} />
          </div>
          <div className="modal-box">
            <div className="flex flex-row gap-3 items-center">
              <div className="w-[50px]">
                <MyLottie animationData={checkAnimation} />
              </div>
              <h3 className="font-bold text-lg">
                {t("web3.transaction reussie")}
              </h3>
            </div>
            <p className="py-4">{t("web3.on s'ecn charge")}</p>

            <SyntaxHighlighter language="javascript" wrapLines wrapLongLines>
              {transactionDone.hash}
            </SyntaxHighlighter>

            <div className="modal-action flex flex-wrap gap-2">
              <button
                onClick={() => toClipboard(transactionDone.hash)}
                className="btn btn-ghost gap-2"
              >
                <CopyIcon className="text-lg" />
                {t("web3.copier le hash")}
              </button>
              <a
                target={"_blank"}
                href={qr.generate(transactionDone.hash)}
                className="btn btn-ghost gap-2 no-underline"
              >
                <CodeQRIcon className="text-lg" />
                {t("web3.QR code")}
              </a>

              <button
                onClick={() => {
                  router.push("/workspace/etudiants/attente");
                }}
                className="btn"
              >
                {t("global.ok")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Certifier;
