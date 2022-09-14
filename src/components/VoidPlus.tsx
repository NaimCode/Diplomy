import { useTranslation } from "next-i18next";
import Link from "next/link";
import router from "next/router";
import { Fragment } from "react";
import { ArrayRightIcon } from "../constants/icons";

type VoirPlusProps = {
  link: string;
};
const VoirPlus = ({ link }: VoirPlusProps) => {
  const { t } = useTranslation();
  
  return (
    <button
     onClick={()=>{
        router.push(link)
     }}
      className="group btn btn-ghost btn-sm gap-2 font-base text-[12px] mr-1"
    >
     <Fragment>
     {t("global.voir plus")}
      <ArrayRightIcon className="-translate-x-[30px] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
     </Fragment>
    </button>
  );
};

export default VoirPlus;
