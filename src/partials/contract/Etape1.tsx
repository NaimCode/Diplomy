import { useTranslation } from 'next-i18next';
import React from 'react'

const Etape1 = () => {
    const {t}=useTranslation()
    const text=(s:string)=>t('workspace.relation.'+s)
  return (
   <>
      <p className="text-center py-3 px-2 bg-warning/20">
              {text("step 1 exp")}
            </p>
            <Steps t={t} /> 
   </>
  )
}

const Steps = ({ t }: { t: any }) => {
    const text = (s: string) => t("workspace.relation." + s);
    return (
      <ul className="steps w-full">
        <li className="step step-primary text-primary">{text("step 1")}</li>
        <li className="step">{text("step 2")}</li>
        <li className="step">{text("step 3")}</li>
        <li className="step">{text("step 4")}</li>
      </ul>
    );
  };
  
export default Etape1