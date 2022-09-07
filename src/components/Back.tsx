import { useTranslation } from "next-i18next";
import React from "react";
import { BackIcon } from "../constants/icons";
import {useRouter} from 'next/router'
const Back = () => {
  const { t } = useTranslation();
const router=useRouter()
  return (
    <label
   
      className=" tooltip tooltip-bottom -translate-x-4 z-50" 
      data-tip={t("workspace.nav.retour")}
    >
      <label onClick={()=>{
router.back()
      }}  className="btn btn-ghost drawer-button ">
        <BackIcon className="icon" />
      </label>
    </label>
  );
};


export default Back;
