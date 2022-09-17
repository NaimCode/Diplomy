import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Upload from "../../components/Upload";
import { FullUserContext } from "../../utils/context";


type TInput={
  nom:string,
  abrev:string,
  identifiant:string,
  paysVille:string,
  address:string,
  nomUser:string,
  email:string
}
const General = () => {
  const { t } = useTranslation();
  const {etablissement} = useContext(FullUserContext); 
  const [nom, setnom] = useState('')
  const [email, setemail] = useState('')
  
  const {data:session}=useSession()
  useEffect(()=>{
    if(session?.user){
      setnom(session.user.name!);
      setemail(session.user.email!);
    }
  },[session?.user])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<TInput>({
    defaultValues: {
       nom:etablissement.nom,
       abrev:etablissement.abrev,
       identifiant:etablissement.identifiant,
       address:etablissement.address,
       paysVille:etablissement.paysVille,
       nomUser:session?.user?.name!,
       email:session?.user?.email!
    },
  });
  const text=(s:string)=>t('workspace.parametre.'+s)
  const text1 = (s: string) => t("inscription." + s);
  return (
    <>
    <div className="flex flex-row gap-[50px]">
      <Upload label={text('logo')} />
      <div className="flex-grow flex flex-col gap-2 lg:gap-5">
        <Input register={register('nom')} label={text1('nom')} />
        <Input register={register('abrev')} label={text1('abrev')} />
        <Input register={register('identifiant')} label={text1('numero/identifiant')} />
        <Input props={{disabled:true}} register={register('paysVille')} label={text1('pays/ville')} />
        <Input register={register('address')} label={text1('adresse')} />
      </div>
    </div>
    <div className="divider my-10"></div>
    <div className="flex flex-row gap-[50px]">
      <Upload url={session?.user?.image!} label={text('photo')} />
      <div className="flex-grow flex flex-col gap-2 lg:gap-5">
        <Input2 value={nom} setvalue={setnom} label={text1('nom utilisateur')} />
        <Input2 props={{disabled:true}} value={email} setvalue={setemail} label={text1('email')} />
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
  register?:any,
  props?:any,
  value?:any,
  setvalue?:any
};

const Input = ({
  containerStyle,
  label,
  error,
  placeholder,
  type,register,props
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
           onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(t('global.onInvalid'))}
           onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
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
const Input2 = ({  containerStyle,  label,  error,  placeholder,  type,register,props,value,setvalue}: InputProps) => {
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
           onChange={(e)=>setvalue(e.target.value)}
           onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(t('global.onInvalid'))}
           onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
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
