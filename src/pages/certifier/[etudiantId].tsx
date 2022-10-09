/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
} from "next";
import SyntaxHighlighter from "react-syntax-highlighter";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import React, { useState } from "react";
import { prisma } from "../../server/db/client";
import {
  Diplome,
  Document,
  Etablissement,
  Etudiant,
  Formation,
  Version,
} from "@prisma/client";
import { useWeb3Connection } from "../../utils/web3";
import MyLottie from "../../components/MyLottie";
import animationData from "../../../public/lotties/ether_loading.json";
import animationData2 from "../../../public/lotties/checkout.json";
import bravoAnimation from "../../../public/lotties/bravo.json";
import checkAnimation from "../../../public/lotties/check.json";
import { useTranslation } from "next-i18next";
import {
  BackIcon,
  CheckIcon,
  CodeQRIcon,
  CopyIcon,
  DiplomaIcon,
  EmailIcon,
  PersonIcon,
} from "../../constants/icons";
import {
  GATEWAY_IPFS,
  useMyTransition,
  useQR,
} from "../../utils/hooks";
import { motion } from "framer-motion";
import router from "next/router";
import { ethers } from "ethers";
import CertificationAbi from "../../../web3/build/contracts/Certification.json";
import { env } from "../../env/client.mjs";
import { toast } from "react-toastify";
import { MContract, MFormation } from "../../models/types";
import { trpc } from "../../utils/trpc";

type FullEtudiantType = Etudiant & {
  document: Document;
  etablissement: Etablissement;
  formation: Formation & {
    versions: Array<Version & { diplome: Diplome }>;
    diplome: Diplome;
  };
};
export const getServerSideProps: GetServerSideProps = async (context) => {

  const id = context.query.etudiantId as string;
  const etudiant: FullEtudiantType = await prisma.etudiant
    .findUnique({
      where: {
        id,
      },
      include: {
        etablissement: true,
        document: true,
        formation: {
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
    })
    .then((data) => JSON.parse(JSON.stringify(data)));
  const contracts: Array<MContract> = await prisma.contract
    .findMany({
      where: {
        NOT: {
          transaction: null,
          address: null,
        },
        membres: {
          some: {
            etablissementId: etudiant.etablissemntId,
          },
        },
      },
      include: {
        aboutissement: {
          include:{
            etablissement:true,
            diplome:true,
            versions:{
              include:{
                diplome:true
              }
            }
          }
        },
        membres: {
          include: {
            etablissement: {
              include: {
                etudiants: {
                  where: {
                    NOT: {
                      transaction: null,
                    },
                  },
                  include: {
                    formation: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    .then((data) => JSON.parse(JSON.stringify(data)));

  const formations_aboutissantes: Array<MFormation> = [];

// console.log(contracts);

  for (const c of contracts) {
    const etudiants: Array<Etudiant> = c.membres
      .map((m) =>
        m.etablissement.etudiants.filter((e) => e.email == etudiant.email)
      )
      .reduce((a, b) => [...a, ...b]);
    const conditions = c.conditionsId.filter((c) => c != etudiant.formationId);
    // console.log('conditions', conditions)
    // console.log('formation etudiant', etudiant.formationId)
    if (conditions.length==0||etudiants.some((e) => conditions.includes(e.formationId))) {
      formations_aboutissantes.push(c.aboutissement);
    }
  }


  return {
    props: {
      etudiant,
      formations_aboutissantes,
      ...(await serverSideTranslations(context.locale||"", ["common"])),
    },
  };
};

const Certifier = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const web3 = useWeb3Connection();
  const [isWeb3Loading, setisWeb3Loading] = useState(false);
  const [transactionDone, settransactionDone] = useState<any | undefined>();

  const etudiant: FullEtudiantType = props.etudiant;
  const { controls } = useMyTransition({
    trigger: web3.active && !web3.isLoading,
  });
  const { t } = useTranslation();
  const qr = useQR();
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

    return date.toLocaleDateString();
  }
  const getInfoForContract = (e: FullEtudiantType): CertificationProps => {
    const documentHash = e.document.hash;
    const nom = e.nom;
    const prenom = e.prenom;
    const etablissementHash = e.etablissemntId;
    //

    const formation = e.formation;
    const versions = formation.versions;
    const intitule =
      formation.versionnage &&
      versions[versions.length - 1]?.diplome.intituleDiff
        ? versions[versions.length - 1]?.diplome.intitule as string
        : formation.intitule as string;

    const version = formation.versionnage
      ? versions[versions.length - 1]?.numero.toString()||""
      : "";

    console.log("formation.versions[-1]", formation.versions[-1]);
    const diplome: Diplome|undefined = formation.versionnage
      ? versions[versions.length - 1]?.diplome
      : formation.diplome;

    //TODO: change type according to language
    const type = diplome?.estVirtuel ? "Virtuel" : "Physique";
    const months = diplome?.expiration ? diplome?.dureeExpiration : undefined;

    const expiration = months ? addMonths(months) : "";
    return {
      intitule,
      etablissementHash,
      nom,
      prenom,
      version,
      documentHash,
      type,
      expiration,
    };
  };
  const getInfoForContractMulti = (e: FullEtudiantType,f:MFormation): CertificationProps => {
    //TODO: create virtuel doc
    const documentHash = "QmUnxr5A8epU3gThy4ZQHrAi9Gqz6eAUCpQfsaoF6pgfx6";
    const nom = e.nom;
    const prenom = e.prenom;
    const etablissementHash =f.etablissementId;
    //

    const formation = f;
    const versions = formation.versions;
    const intitule =
      formation.versionnage &&
      versions[versions.length - 1]?.diplome.intituleDiff
        ? versions[versions.length - 1]?.diplome.intitule
        : formation.intitule;

    const version = formation.versionnage
      ? versions[versions.length - 1]?.numero.toString()
      : "";

    const diplome: Diplome |undefined= formation.versionnage
      ? versions[versions.length - 1]?.diplome
      : formation.diplome;

    //TODO: change type according to language
    const type = diplome?.estVirtuel ? "Virtuel" : "Physique";
    const months = diplome?.expiration ? diplome?.dureeExpiration : undefined;

    const expiration = months ? addMonths(months) : "";
    return {
      intitule:intitule as string,
      etablissementHash,
      nom,
      prenom,
      version:version as string,
      documentHash,
      type,
      expiration,
    };
  };

  const onSign = async () => {
    //TODO: auto convertion

    console.log("price", env.NEXT_PUBLIC_PRICE);
    const hashs:Array<{transaction:object,codeQR:string,etudiant:any}>=[]
    const contract = new ethers.Contract(
      ethers.utils.getAddress("0xba47b24Ce8c1c14bb68dC6E0af23a050c11424a1"),
      CertificationAbi.abi,
      web3.provider
    );
    const signer = web3.provider?.getSigner();
    if (!signer) {
      toast.error(t("web3.rejeter"));
    } else {
      const contractSigner = contract.connect(signer);
      let hash = undefined;
      const info = getInfoForContract(etudiant);
      console.log(info);

      setisWeb3Loading(true);

      try {
        hash = await contractSigner.NouveauDiplome(
          info.intitule,
          info.documentHash,
          info.nom,
          info.etablissementHash,
          info.prenom,
          info.version,
          info.expiration,
          info.type,
          ethers.utils.getAddress(web3.account||''),
          { value: env.NEXT_PUBLIC_PRICE }
        );
        const input={
          transaction: {
            hash: hash.hash,
            blockNumber: hash.blockNumber,
            blockHash: hash.blockHash,
            signataire: hash.from,
            type: "CERTIFICATION",
            chainId: hash.chainId,
          },

          etudiant: etudiant,
          codeQR: qr.generate(hash.hash, 160),
        }
        hashs.push(input)
        if(props.formations_aboutissantes.length==0){
        certifier(input)
        }else{
         
          for(const f of props.formations_aboutissantes){
            const info = getInfoForContractMulti(etudiant,f);
           const hash = await contractSigner.NouveauDiplome(
              info.intitule,
              info.documentHash,
              info.nom,
              info.etablissementHash,
              info.prenom,
              info.version,
              info.expiration,
              info.type,
              ethers.utils.getAddress(web3.account||""),
              { value: env.NEXT_PUBLIC_PRICE }
            );

            hashs.push({
              transaction: {
                hash: hash.hash,
                blockNumber: hash.blockNumber,
                blockHash: hash.blockHash,
                signataire: hash.from,
                type: "CERTIFICATION",
                chainId: hash.chainId,
              },
              etudiant: etudiant,
              codeQR: qr.generate(hash.hash, 160),
            })
          }
          console.log(hashs);
          
       certifierMultiple(hashs)
        }

          
      } catch (error: any) {
        if ((error.code = -32000)) {
          console.log("error", error);
          toast.error(t("web3.montant insuffisant"));
          setisWeb3Loading(false);
        } else {
          console.log("error", error);
          toast.error(t("global.toast erreur"));
          setisWeb3Loading(false);
        }
      }
    }
  };

  // if(transactionDone){
  //   return <div></div>
  // }


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
  const { mutate: certifierMultiple } = trpc.useMutation(["transaction.certifier multiple"], {
    onError: (err:any) => {
      console.log("error", err);
      toast.error(t("global.toast erreur"));
      setisWeb3Loading(false);
    },
    onSuccess: (data:any) => {
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
          <div className="divider"></div>
         {props.formations_aboutissantes.length!=0&& 
         <div className="bg-warning p-4 my-6 bg-opacity-60 border-warning">
          {t('workspace.relation.conditions rempli')} {props.formations_aboutissantes.length} {t('workspace.relation.contract(s)')} 
          </div>}
          <div className="w-full space-y-3">
            <div className="flex flex-row gap-4 items-center">
              <PersonIcon className="text-lg" />
              <h6>
                {etudiant.prenom} {etudiant.nom}
              </h6>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <EmailIcon className="text-lg" />
              <p>{etudiant.email}</p>
            </div>
            <div className="flex flex-row gap-4 items-center">
              <DiplomaIcon className="text-lg" />
              <p>{etudiant.formation.intitule}</p>
            </div>
            <div className="py-3"></div>
            <img
              src={GATEWAY_IPFS + etudiant.document.hash}
              alt="doc"
              className="mx-auto"
            />
          </div>
          <div className="divider"></div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => onSign()}
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
                rel="noreferrer"
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

export const Loading = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-base-100 h-screen w-screen flex flex-col justify-center items-center"
    >
      <div className="max-w-[400px] flex flex-col justify-center items-center">
        <MyLottie animationData={animationData} />
        <p className="-translate-y-[80px]">{t("global.chargement")}</p>
      </div>
    </motion.div>
  );
};
export const Message = ({
  web3,
}: {
  web3: {
    connect: () => Promise<void>;
    disconnect: () => void;
    account: string | null | undefined;
    active: boolean;
    isLoading: boolean;
  };
}) => {
  const { t } = useTranslation();
  return web3.active ? (
    <div className="alert">
      <div>
        <CheckIcon />
        <div>
          <h6 className="">{t("web3.actif compte")}</h6>
          <div className="text-xs font-bold">{web3.account}</div>
        </div>
      </div>
      <div className="flex-none">
        <button
          onClick={() => web3.disconnect()}
          className="btn btn-sm btn-warning"
        >
          {t("web3.deconnexion")}
        </button>
      </div>
    </div>
  ) : (
    <div className="alert alert-error bg-opacity-60 shadow-lg">
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-current flex-shrink-0 h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{t("web3.veuillez connecter")}</span>
      </div>
      <div className="flex-none">
        <button onClick={() => web3.connect()} className="btn btn-sm">
          {t("web3.connexion")}
        </button>
      </div>
    </div>
  );
};
export default Certifier;
