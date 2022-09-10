/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTranslation } from "next-i18next";

type InputFormProps = {
  register: any;
  placeholder?:string,
  inputClass?:string,
  containerClass?:string,
  label?:string,
  error:any,
  toggle?:boolean,
  type?:string,
  props?:any
  
};
const InputForm = ({props,type="text", register,placeholder,toggle=false,inputClass="",label,error,containerClass="w-full" }: InputFormProps) => {
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
        {...props}
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
        {...props}
        placeholder={placeholder||(t('workspace.formation.saisir'))}
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(t('global.onInvalid'))}
        onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
        className={`input input-bordered  w-full ${error?"input-error":""} ${inputClass}`}
      />
      
    </div>
  );
};

export const TextAreaForm = ({ register,placeholder,inputClass="",label,error,containerClass="w-full" }: InputFormProps) => {
  const { t } = useTranslation();

  return (
    <div className={`form-control  ${containerClass}`}>
      {label && <label className="label">
        <span className="label-text">{label}</span>
      </label>
      }
      <textarea
    
    rows={4}
        {...register}
        placeholder={placeholder||(t('workspace.formation.saisir'))}
        onInvalid={e => (e.target as HTMLInputElement).setCustomValidity(t('global.onInvalid'))}
        onInput={e => (e.target as HTMLInputElement).setCustomValidity('')}
        className={`textarea textarea-bordered  w-full ${error?"input-error":""} ${inputClass}`}
      />
      
    </div>
  );
};
export default InputForm;
