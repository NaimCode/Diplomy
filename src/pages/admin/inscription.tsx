import { motion } from "framer-motion";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useState } from "react";
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
  return {
    props: {
  ...(await serverSideTranslations(ctx.locale!, ["common"])),
      demande,
      error: id ? false : true,
      isNotExist:demande?false:  true,
      code:process.env.ADMINS_PASSWORD
    },
  };
};
const DemandeInscription = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { mutate: inscrire, isLoading } = trpc.useMutation(
    ["auth.inscription"],
    {
      onSuccess: (data) => {
        console.log("Inscrire success:", data);
        push("/state/success?type=demande-acceptee");
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
  } = demande;

  if (isNotExist) return <IsNotExist />;

  return (
    <>
      <Modal
        backdrop="static"
        dialogClassName="translate-y-[25%] bg-green-400"
        backdropClassName="backdrop-blur-sm "
        open={!isAdmin}
      >
        <Modal.Body>
          <>
          <Input
            icon={<UnlockIcon className="icon" />}
            value={code}
            setValue={setCode}
            placeholder="global.mot de passe"
            hoverable={false}
            border
          />
          {err && (
            <span className="text-sm text-left text-error">
              {t("inscription.mot de passe invalide")}
            </span>
          )}
          </>
        </Modal.Body>

        <Modal.Footer className="flex flex-row gap-3 justify-end">
          <button
            onClick={() => {
                console.log("code",props.code);
                
              if (code == props.code) {
                setisAdmin(true);
                seterr(false);
              } else {
                seterr(true);
              }
            }}
            className="btn"
          >
            {t("inscription.valider")}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="min-h-screen bg-primary flex justify-center items-center  p-3 md:p-10 text-center md:text-left">
        <form className=" mockup-window border p-3 md:p-10 bg-base-100">
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
              type="submit"
              className={`btn btn-warning w-full ${isLoading && "loading"}`}
            >
              {t("inscription.valider")}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

const IsNotExist = () => {
  return <div>isNotExist</div>;
};
export default DemandeInscription;
