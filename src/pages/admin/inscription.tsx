import { motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../components/Input";
import {
  AdresseIcon,
  EmailIcon,
  EtablissementIcon,
  MapIcon,
  PersonIcon,
  ShortTextIcon,
  TelIcon,
  UnlockIcon,
} from "../../constants/icons";
import { trpc } from "../../utils/trpc";
import { Modal } from "rsuite";
import { prisma } from "../../server/db/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

//TODO: implementing language for admins

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const qId = ctx.query.id!;
  const id = qId as string;

  const demande = JSON.parse(
    JSON.stringify(
      await prisma.inscription.findUnique({
        where: {
          id,
        },
      })
    )
  );
  if (!id)
    return {
      redirect: {
        destination: "/404",
        permanent: true,
      },
    };
  if (!demande)
    return {
      redirect: {
        destination: "/state/success?type=inscription-accepted",
        permanent: true,
      },
    };
  return {
    props: {
      ...(await serverSideTranslations(ctx.locale!, ["common"])),
      demande,
      code: process.env.ADMINS_PASSWORD,
    },
  };
};
const DemandeInscription = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { mutate: accepter, isLoading } = trpc.useMutation(
    ["auth.inscription accepted"],
    {
      onSuccess: (data) => {
        console.log("Inscrire success:", data);
        push("/state/success?type=inscription-accepted");
      },
      onError: (err) => {
        console.log("Inscrire error:", err);
        toast.error(t("global.toast erreur"));
      },
    }
  );
  const { demande, error, isNotExist } = props;
  const [isAdmin, setisAdmin] = useState(false);
  const [err, seterr] = useState(false);
  const [code, setCode] = useState("");
  const {
    etablissement,
    email,
    responsable,
    paysVille,
    abrev,
    identifiant,
    tel,
    address,
    id,
  } = demande;
  const handleChechPwd = () => {
    if (code == props.code) {
      setisAdmin(true);
      seterr(false);
    } else {
      seterr(true);
      toast.error(t("admin.mot de passe invalide"));
    }
  };
  return (
    <>
      <div className={`modal ${!isAdmin && "modal-open"} backdrop-blur-md`}>
        <div className="modal-box  flex justify-center items-center">
          <div className="form-control">
            <div className="input-group input-group-lg w-full">
              <input
                type="password"
                onChange={(e) => setCode(e.target.value)}
                value={code}
                placeholder={t("admin.mot de passe")}
                className={`input input-bordered ${err && "input-error"}`}
              />
              <button
                onClick={handleChechPwd}
                title="Déverouiller"
                className="btn btn-square"
              >
                <UnlockIcon className="icon" />
              </button>
            </div>
          </div>
          <div className="modal-action"></div>
        </div>
      </div>

      <div className="min-h-screen bg-primary flex justify-center items-center  p-3 md:p-10 text-center md:text-left">
        <div className=" mockup-window border p-3 md:p-10 bg-base-100">
          <div className="h-6 md:h-10"></div>
          <div className="form-control flex flex-col gap-3 md:gap-5">
            <Input
              icon={<EtablissementIcon className="icon" />}
              value={etablissement}
              placeholder="inscription.nom"
              hoverable={false}
              border
              readOnly
              tooltip
            />
            <div className="flex flex-col md:flex-row gap-3 md:gap-5">
              <Input
                icon={<ShortTextIcon className="icon" />}
                value={abrev}
                placeholder="inscription.abrev"
                readOnly
                border
                tooltip
                hoverable={false}
              />
              <Input
                icon={<ShortTextIcon className="icon" />}
                value={identifiant}
                placeholder="inscription.numero/identifiant"
                readOnly
                hoverable={false}
                border
                tooltip
              />
            </div>

            <Input
              icon={<MapIcon className="icon" />}
              value={paysVille}
              placeholder="inscription.pays/ville"
              readOnly
              hoverable={false}
              border
              tooltip
            />

            <Input
              icon={<AdresseIcon className="icon" />}
              value={address}
              placeholder="inscription.adresse"
              readOnly
              hoverable={false}
              border
              tooltip
            />

            <div className="divider"></div>
            <Input
              icon={<PersonIcon className="icon" />}
              value={responsable}
              placeholder="inscription.responsable"
              readOnly
              hoverable={false}
              border
              tooltip
            />
            <div className="flex flex-col md:flex-row gap-3 md:gap-5">
              <Input
                icon={<EmailIcon className="icon" />}
                value={email}
                placeholder="inscription.email"
                readOnly
                type="email"
                hoverable={false}
                border
                tooltip
              />

              <Input
                icon={<TelIcon className="icon" />}
                value={tel}
                placeholder="inscription.tel"
                readOnly
                type="tel"
                hoverable={false}
                border
                tooltip
              />
            </div>
          </div>
          <div className="mt-[25px] md:mt-[40px]">
            <button
              onClick={() => {
                accepter({ id });
              }}
              className={`btn btn-warning w-full ${isLoading && "loading"}`}
            >
              {t("inscription.valider")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DemandeInscription;
