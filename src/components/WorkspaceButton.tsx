import { useTranslation } from "next-i18next";
import React from "react";
import Dialog from "./Dialog";
const WorkspaceButton = () => {
  const { t } = useTranslation();
  return (
    <Dialog
     
      title={t("home.Dialog title")}
      trigger={(fn) => (
        <button onClick={fn} className="btn btn-primary">
          {t("home.Button workspace")}
        </button>
      )}
    >
    
    </Dialog>
  );
};


export default WorkspaceButton;
