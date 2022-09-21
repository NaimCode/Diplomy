import { motion } from "framer-motion";
import _ from "lodash";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Upload from "../../components/Upload";
import { FullUserContext } from "../../utils/context";
import { useMyTransition } from "../../utils/hooks";

type TInput = {
  nom: string;
  abrev: string;
  identifiant: string;
  paysVille: string;
  address: string;

};

const General = () => {
  const { t } = useTranslation();
  const { etablissement } = useContext(FullUserContext);
  const [nom, setnom] = useState("");
  const [email, setemail] = useState("");
  const [photo, setphoto] = useState<string|undefined>();

  const { data: session } = useSession();
  useEffect(() => {
    if (session?.user) {
      setnom(session.user.name!);
      setemail(session.user.email!);
      setphoto(session.user.image!);
    }
  }, [session?.user]);
  const initData = {
    nom: etablissement.nom,
    abrev: etablissement.abrev,
    identifiant: etablissement.identifiant,
    address: etablissement.address,
    paysVille: etablissement.paysVille,

  };
  const {
    register,
    handleSubmit,
    getValues,
    watch,
    formState: { errors },
  } = useForm<TInput>({
    defaultValues: initData,
  });
  const text = (s: string) => t("workspace.parametre." + s);
  const text1 = (s: string) => t("inscription." + s);

  const updable = () =>  !_.isEqual(initData,watch()) || nom!=session?.user?.name! ||photo!=session?.user?.image!
  
  const { controls } = useMyTransition({ trigger: updable() });

  return (
    <>
    
      <div className="flex flex-row gap-[50px]">
        <Upload props={{accept:"image/png"}} url={etablissement.logo} id={etablissement.id} label={text("logo")} />
        <div className="flex-grow flex flex-col gap-2 lg:gap-5">
          <Input register={register("nom")} label={text1("nom")} />
          <Input register={register("abrev")} label={text1("abrev")} />
          <Input
            register={register("identifiant")}
            label={text1("numero/identifiant")}
          />
          <Input
            props={{ disabled: true }}
            register={register("paysVille")}
            label={text1("pays/ville")}
          />
          <Input register={register("address")} label={text1("adresse")} />
        </div>
      </div>
      <div className="divider my-10"></div>
      <div className="flex flex-row gap-[50px]">
        <Upload id={email} url={photo} label={text("photo")} />
        <div className="flex-grow flex flex-col gap-2 lg:gap-5">
          <Input2
            value={nom}
            setvalue={setnom}
            label={text1("nom utilisateur")}
          />
          <Input2
            props={{ disabled: true }}
            value={email}
            setvalue={setemail}
            label={text1("email")}
          />
        <div className="py-3 lg:py-6">
        <motion.div animate={controls} className=" flex flex-row justify-between items-center">
            <button className="btn btn-outline">{t("global.annuler")}</button>
            <button className="btn">{text1("valider")}</button>
          </motion.div>
        </div>
        </div>
      </div>
    </>
  );
};

type InputProps = {
  containerStyle?: string;
  label?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  register?: any;
  props?: any;
  value?: any;
  setvalue?: any;
};

const Input = ({
  containerStyle,
  label,
  error,
  placeholder,
  type,
  register,
  props,
}: InputProps) => {
  const { t } = useTranslation();
  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type || "text"}
        {...register}
        {...props}
        onInvalid={(e) =>
          (e.target as HTMLInputElement).setCustomValidity(
            t("global.onInvalid")
          )
        }
        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
        placeholder={placeholder || t("global.saisir")}
        className={`input bg-base-200 w-full`}
      />
      <label className="label">
        <span className="label-text-alt"></span>
        <span className="label-text-alt">{error}</span>
      </label>
    </div>
  );
};
//
const Input2 = ({
  containerStyle,
  label,
  error,
  placeholder,
  type,
  register,
  props,
  value,
  setvalue,
}: InputProps) => {
  const { t } = useTranslation();
  return (
    <div className={`form-control ${containerStyle}`}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input
        type={type || "text"}
        value={value}
        {...props}
        onChange={(e) => setvalue(e.target.value)}
        onInvalid={(e) =>
          (e.target as HTMLInputElement).setCustomValidity(
            t("global.onInvalid")
          )
        }
        onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
        placeholder={placeholder || t("global.saisir")}
        className={`input bg-base-200 w-full`}
      />
      <label className="label">
        <span className="label-text-alt"></span>
        <span className="label-text-alt">{error}</span>
      </label>
    </div>
  );
};
export default General;
