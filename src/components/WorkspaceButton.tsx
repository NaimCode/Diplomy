import { useTranslation } from "next-i18next";
import React from "react";

const WorkspaceButton = () => {
  const { t } = useTranslation();
  return (
    <button className="btn btn-primary">{t("home.Button workspace")}</button>
  );
};

export default WorkspaceButton;
