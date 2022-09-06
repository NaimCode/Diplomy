import { useTranslation } from "next-i18next";
import React from "react";
import { LogOutIcon, MenuIcon } from "../constants/icons";

const LogOut = () => {
  const { t } = useTranslation();

  return (
    <label
   
      className="tooltip tooltip-bottom lg:hidden" 
      data-tip={t("workspace.nav.deconnexion")}
    >
      <span  className="btn btn-ghost drawer-button ">
        <LogOutIcon className="icon" />
      </span>
    </label>
  );
};

export default LogOut