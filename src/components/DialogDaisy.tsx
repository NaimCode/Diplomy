import { useTranslation } from "next-i18next";
import { ReactNode, useState } from "react";

import { DialogProps } from "./Dialog";

type DialogDaisyProps = DialogProps & {
  clickOffSide?:boolean
  daisyTrigger: (fn: () => void) => ReactNode;
};

const DialogDaisy = ({

  noFooter,
  title,
  children,
  noValidate,
  noCancel,
  validateText,
  cancelText,
  daisyTrigger,
  clickOffSide=true,
}: DialogDaisyProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
  return (
    <>
    {daisyTrigger(handleOpen)}
    <input placeholder="__" type="checkbox" id="my-modal-3" className="modal-toggle" />
      <div onClick={()=>{
        clickOffSide && handleClose()
      }} className={`modal ${open && "modal-open"} backdrop-blur-sm ${clickOffSide&&"cursor-pointer"}`}>
        <div className="modal-box relative">
        <label htmlFor="my-modal-3" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 className="font-bold text-lg">
          {title}
          </h3>
          {children}
          <div hidden={noFooter} className="modal-action">
          <button
              hidden={noCancel}
              className="btn btn-ghost"
              onClick={handleClose}
            >
              {cancelText || t("global.dialog cancel")}
            </button>
            <button hidden={noValidate} className="btn" onClick={handleClose}>
              {validateText || t("global.dialog validate")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DialogDaisy;
