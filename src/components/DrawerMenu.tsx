import { useTranslation } from "next-i18next";
import React from "react";
import { ButtonToolbar, Button, Drawer, Placeholder } from "rsuite";
import { MenuIcon } from "../constants/icons";

const DrawerMenu = () => {
  const { t } = useTranslation();

  return (
    <label
   
      className="tooltip tooltip-bottom lg:hidden" 
      data-tip={t("workspace.nav.menu")}
    >
      <label htmlFor="Menu" className="btn btn-ghost drawer-button ">
        <MenuIcon className="icon" />
      </label>
    </label>
  );
};


export default DrawerMenu;
