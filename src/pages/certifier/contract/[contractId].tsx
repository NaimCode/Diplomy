/* eslint-disable @next/next/no-img-element */

import { ContractFactory } from "ethers";
import { motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import router from "next/router";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { toast } from "react-toastify";

import MyLottie from "../../../components/MyLottie";
import {
  BackIcon,

  CopyIcon,
  CodeQRIcon,
} from "../../../constants/icons";
import { env } from "../../../env/client.mjs";
import {

  useMyTransition,
  useQR,
} from "../../../utils/hooks";
import { trpc } from "../../../utils/trpc";
import { useWeb3Connection } from "../../../utils/web3";
import { Loading, Message } from "../[etudiantId]";
import animationData2 from "../../../../public/lotties/checkout.json";
import bravoAnimation from "../../../../public/lotties/bravo.json";
import checkAnimation from "../../../../public/lotties/check.json";
import { MContract, MFormation } from "../../../models/types";
import { FormationItem } from "../../contract/[contractId]/confirmation";
import Partenariat from "../../../../web3/build/contracts/Partenariat.json";
export const getServerSideProps: GetServerSideProps = async (context) => {


  const id = context.query.contractId as string;
  const contract: MContract = await prisma?.contract
    .findUniqueOrThrow({
      where: {
        id,
      },
      include: {
        aboutissement: {
          include: {
            etablissement: true,
          },
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
      ...(await serverSideTranslations(context.locale||"", ["common"])),
    },
  };
};


const Certifier = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const web3 = useWeb3Connection();
  const [isWeb3Loading, setisWeb3Loading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [transactionDone, settransactionDone] = useState<any | undefined>();
  const contract: MContract = props.contract;
  const formations: Array<MFormation> = props.formations;
  const { controls } = useMyTransition({
    trigger: web3.active && !web3.isLoading,
  });
  const { t } = useTranslation();


  //test
  const { mutate: certifier } = trpc.useMutation(
    ["transaction.certifier contract"],
    {
      onError: (err) => {
        console.log("error", err);
        toast.error(t("global.toast erreur"));
        setisWeb3Loading(false);
      },
      onSuccess: (data) => {
        settransactionDone(data.transaction);
        setisWeb3Loading(false);
      },
    }
  );

  const qr=useQR()
  const onSign = async () => {
    const signer = web3.provider?.getSigner();
    const factory = new ContractFactory(
      Partenariat.abi,
      Partenariat.bytecode,
      signer
    );
  
    // If your contract requires constructor args, you can specify them here
    const c: MContract = props.contract;
    const partenaires: Array<string> = c.membres.map((m) => m.etablissementId);
    const formation_requises: Array<string> = props.formations.map(
      (f: MFormation) => f.id
    );
    const formation_aboutissante = c.aboutissementId;

    const partenaires_name: Array<string> = c.membres.map(
      (m) => m.etablissement.nom
    );
    const formation_requises_name: Array<string> = props.formations.map(
      (f: MFormation) => f.intitule
    );

    const formation_aboutissante_name = c.aboutissement.intitule;
   // try {
    const contractSigner = await factory.deploy(
      partenaires,
      formation_requises,
      formation_aboutissante,
      partenaires_name,
      formation_requises_name,
      formation_aboutissante_name,
      env.NEXT_PUBLIC_PRICE
    );
    await contractSigner.deployed();


    certifier({
      codeQR:qr.generate(contractSigner.deployTransaction.hash,160),
      emails:formations.map((e)=>e.etablissement.membresAutorises[0]||""),
      address: contractSigner.address,
      id: c.id,
      transaction: {
        hash: contractSigner.deployTransaction.hash,
        blockNumber: contractSigner.deployTransaction.blockNumber,
        blockHash: contractSigner.deployTransaction.blockHash,
        signataire: contractSigner.deployTransaction.from,
        type: "CONTRACT",
        chainId: contractSigner.deployTransaction.chainId,
      },
    });
  // } catch (error:any) {
  //   if(error.code= -32000){
  //     console.log("error", error);
  //     toast.error(t("web3.montant insuffisant"));
  //     setisWeb3Loading(false)
  //   }else{
  //     console.log("error", error);
  //     toast.error(t("global.toast erreur"));
  //     setisWeb3Loading(false)
  //   }
  
  // }
  };

  const toClipboard = (data: string) => {
    navigator.clipboard.writeText(data);
    toast.success(t("global.text copie"));
  };

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
                  src={m.etablissement.logo||""}
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

          <div className="divider"></div>
          <div>
            <h6 className="my-3">{t("workspace.relation.step 2")}</h6>

            {formations.map((m, i) => (
              <FormationItem key={i} item={m} classCard="rounded-md" />
            ))}
          </div>
          <div className="divider"></div>
          <h6 className="my-3">{t("workspace.relation.step 3")}</h6>
          <FormationItem
            item={contract.aboutissement}
            classCard="text-primary rounded-md"
          />
          <div className="divider"></div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => {
                onSign();
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
              <a  rel="noreferrer" target={"_blank"} href={qr.generate(transactionDone.hash)} className="btn btn-ghost gap-2 no-underline">
                <CodeQRIcon className="text-lg"/>
                {t('web3.QR code')}</a>

              <button
                onClick={() => {
                  router.push("/workspace/relation");
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
