import { useTranslation } from "next-i18next";
import { ReactNode, useState } from "react";
import { Modal, ButtonToolbar } from "rsuite";
import { CloseIcon } from "../constants/icons";

export type DialogProps = {
  trigger?: (fn: () => void) => ReactNode;
  title?: string;
  children: ReactNode;
  noCancel?: boolean;
  noValidate?: boolean;
  cancelText?: string;
  validateText?: string;
  noFooter?: boolean;
  noHeader?: boolean;
  noClose?: boolean;
};
const Dialog = ({
  trigger,
  noFooter,
  title,
  children,
  noValidate,
  noCancel,
  validateText,
  cancelText,
  noHeader,
  noClose,
}: DialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();

  return (
    <>
      <ButtonToolbar>{trigger?.(handleOpen)}</ButtonToolbar>

      <Modal
        dialogClassName="translate-y-[25%] bg-green-400"
        backdropClassName="backdrop-blur-sm "
        open={open}
        onClose={handleClose}
      >
        {!noHeader && (
          <Modal.Header
            closeButton={false}
            className="flex flex-row justify-between gap-2 items-center"
          >
            <Modal.Title hidden={title == undefined}>{title}</Modal.Title>
            {!noClose && (
              <CloseIcon
                onClick={handleClose}
                className="icon cursor-pointer transition-all hover:scale-105"
              />
            )}
          </Modal.Header>
        )}
        <Modal.Body>{children}</Modal.Body>
        {!noFooter && (
          <Modal.Footer className="flex flex-row gap-3 justify-end">
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
          </Modal.Footer>
        )}
      </Modal>
    </>
  );
};

export const DialogConfirmation = ({
  children,
  classButton,
  onClick,
}: {
  children: ReactNode;
  classButton: string;
  onClick: ()=>void;
}) => {
  const { t } = useTranslation();
  return (
    <>
      <label htmlFor="di" className={`modal-button ${classButton}`}>
        {children}
      </label>

      <input type="checkbox" id="di" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t("global.confirmation")}</h3>
          <div className="modal-action">
            <label htmlFor="di" className="btn btn-ghost">
              {t("global.annuler")}
            </label>
            <label htmlFor="di" onClick={() => onClick()} className="btn">
              {t("global.confirmer")}
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export const DialogOk = ({
  setOpen,
  open,
  text,
  head,
}: {
  text: string;
  head?: string;
  open: boolean;
  setOpen: (s:boolean)=>void;
}) => {
  const { t } = useTranslation();

  return (
    <>
      <div className={`modal ${open && "modal-open"}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg">{t(head || "")}</h3>
          <p>{t(text)}</p>
          <div className="modal-action">
            <button onClick={() => setOpen(false)} className="btn">
              {t("global.ok")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default Dialog;
