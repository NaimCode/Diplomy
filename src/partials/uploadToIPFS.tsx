import { Etudiant } from "@prisma/client";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import React, {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { Drawer, Button, Placeholder, Uploader } from "rsuite";
import { UploadIcon } from "../constants/icons";

type UploadToIPFSProps = {
  close: Function;
  etudiant: Etudiant | undefined;
};
const UploadToIPFS = ({ close, etudiant }: UploadToIPFSProps) => {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [file, setfile] = useState();
  const [type, settype] = useState<string | undefined>();
  const [preview, setpreview] = useState<string | undefined>();

  const fileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const f = files[0];
      settype(getType(f?.type!));
      const url = URL.createObjectURL(f!);
      setpreview(url);
    }
  };
  const getType = (s: string) => {
    const l = s.split("/");
    if (l[0] == "application") {
      return l[1];
    }
    return l[0];
  };
  return (
    <Drawer
      size={"full"}
      placement={"bottom"}
      backdrop="static"
      open={etudiant ? true : false}
      onClose={() => close(undefined)}
    >
      {etudiant && (
        <>
          <Drawer.Header closeButton={false}>
            <Drawer.Title className="hidden lg:flex items-center">
              <h6>
                {etudiant!.prenom} {etudiant!.nom}
              </h6>
            </Drawer.Title>
            <Drawer.Actions>
              <button
                className="btn btn-sm lg:btn-md  btn-ghost mx-2"
                onClick={() => close(undefined)}
              >
                {t("global.annuler")}
              </button>

              <button
                onClick={() => close(undefined)}
                className="btn btn-primary  btn-sm lg:btn-md"
              >
                {t("global.confirmer")}
              </button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body className="relative">
           
            <div>
              {preview ? (
                <img src={preview} alt="fichier" className="mx-auto object-contain" />
              ) : (
                <div className="w-full h-[40%] border-dashed border-[1px]" />
              )}
            </div>
            <div className="flex gap-2 justify-center items-center fixed bottom-4 backdrop-blur-sm bg-base-300  rounded-xl py-2 px-5 left-[50%] -translate-x-[50%] flex-row shadow-lg">
              <input
                accept=".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                onChange={fileChange}
                hidden={true}
                ref={input}
                type={"file"}
              />
               {type && <div className="badge">{type}</div>}
              <button
                onClick={() => {
                  input.current?.click();
                }}
                className="btn gap-3 btn-sm btn-ghost"
              >
                <UploadIcon className="icon" />
                {t("global.click or drag")}
              </button>
            </div>
          </Drawer.Body>
        </>
      )}
    </Drawer>
  );
};

export default UploadToIPFS;
