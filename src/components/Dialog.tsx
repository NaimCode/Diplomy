import { useTranslation } from "next-i18next";
import { ReactNode, useState } from "react";
import { Modal, ButtonToolbar } from "rsuite";
import { CloseIcon } from "../constants/icons";
import { useLocale } from "../utils/hooks";

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
  noClose
}: DialogProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { t } = useTranslation();
 const {isAr}=useLocale()
  return (
    <>
      <ButtonToolbar>{trigger?.(handleOpen)}</ButtonToolbar>

      <Modal
  
      dialogClassName="rounded-xl bg-primary" backdropClassName="backdrop-blur-sm " open={open} onClose={handleClose}>
        <Modal.Header hidden={noHeader} closeButton={false} className="flex flex-row justify-between gap-2 items-center">
          <Modal.Title hidden={title == undefined}>{title}</Modal.Title>
          {!noClose&& <CloseIcon onClick={handleClose} className="icon cursor-pointer transition-all hover:scale-105"/>}
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        {!noFooter && (
          <Modal.Footer
            className="flex flex-row gap-3 justify-end"
          
          >
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

export default Dialog;
