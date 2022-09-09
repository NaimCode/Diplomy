import { useTranslation } from "next-i18next";

type InputFormProps = {
  register: any;
  placeholder?:string,
  inputClass?:string,
  containerClass?:string,
  label?:string,
  error:any,
  toggle?:boolean,
  type?:string
  
};
const InputForm = ({type="text", register,placeholder,toggle=false,inputClass="",label,error,containerClass="w-full" }: InputFormProps) => {
  const { t } = useTranslation();
if(toggle){
    return <div className={`form-control ${containerClass}`}>
    <label className="label cursor-pointer">
      <span className="label-text">
        {label}
      </span>
      <input
      type="checkbox"
           {...register}
        // type="checkbox"
        className={`toggle toggle-primary ${error?"input-error":""}`}
   
      />
    </label>
  </div>
}

  return (
    <div className={`form-control  ${containerClass}`}>
      {label && <label className="label">
        <span className="label-text">{label}</span>
      </label>
      }
      <input
      type={type}
        {...register}
        placeholder={placeholder||(t('workspace.formation.saisir'))}
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(t('global.onInvalid'))}
        onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
        className={`input input-bordered  w-full ${error?"input-error":""} ${inputClass}`}
      />
      
    </div>
  );
};

export default InputForm;
