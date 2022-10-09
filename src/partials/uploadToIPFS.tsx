/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { Etudiant } from "@prisma/client";
import { useTranslation } from "next-i18next";
import React, {
  ChangeEvent,
  useRef,
  useState,
} from "react";
import { Drawer } from "rsuite";
import { AddFileIcon, UploadIcon } from "../constants/icons";
import { Document, Page } from "react-pdf";
import { useUploadToIPFS } from "../utils/hooks";

type UploadToIPFSProps = {
  close: (s:any)=>void;
  etudiant: Etudiant | undefined;
  onValid:(s:any)=>void,
};
//TODO: mobile for choisir un fichier
//TODO: limit size of a file
const UploadToIPFS = ({ close, etudiant,onValid }: UploadToIPFSProps) => {
  const { t } = useTranslation();
  const input = useRef<HTMLInputElement>(null);
  const [file, setfile] = useState<File | undefined>();
  const [type, settype] = useState<string | undefined>();
  const [isLoading, setisLoading] = useState(false);
  const [preview, setpreview] = useState<string | undefined>();
  const store = useUploadToIPFS();
  const fileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const f = files[0];
      setfile(f);
      settype(getType(f?.type as string));
      const url = URL.createObjectURL(f as File);
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
  const toIPFS = async () => {
    setisLoading(true);
    const result = await (await store.init()).add(file as File);
    setisLoading(false);
    setpreview(undefined)
    setfile(undefined)
    settype(undefined)
    onValid(result);
   
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
                {etudiant?.prenom} {etudiant?.nom}
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
                disabled={file ? false : true}
                onClick={toIPFS}
                className={`btn btn-primary  btn-sm lg:btn-md ${
                  isLoading && "loading"
                }`}
              >
                {t("global.confirmer")}
              </button>
            </Drawer.Actions>
          </Drawer.Header>
          <Drawer.Body className="relative">
            <div>
              {preview ? (
                <DisplayContent url={preview} type={type as string} file={file as File} />
              ) : (
                <div className="w-full h-[300px] border-dashed border-[1px] flex items-center justify-center">
                  <AddFileIcon className="icon" />
                </div>
              )}
            </div>

            <div
              //TODO: fix display
              className="flex gap-2 justify-center items-center fixed bottom-4 backdrop-blur-sm bg-base-300  rounded-xl px-2 py-2 lg:px-5 lg:left-[50%] lg:-translate-x-[50%] flex-row shadow-lg"
            >
              <input
                accept="image/*"
                //TODO: unable other type files
                // ".xlsx,.xls,image/*,.doc, .docx,.ppt, .pptx,.txt,.pdf"

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
                className="btn gap-2 btn-sm btn-ghost"
              >
                <UploadIcon className="icon" />
                {t("global.choisir fichier")}
              </button>
            </div>
          </Drawer.Body>
        </>
      )}
    </Drawer>
  );
};

type DisplayContentProps = {
  type: string;
  url: string;
  file: File;
};
const DisplayContent = ({ type, url, file }: DisplayContentProps) => {
  const [page] = useState<number | undefined>(undefined);


  if (type == "pdf") {
    return (
      <Document file={file} >
        <Page pageNumber={page} />
      </Document>
    );
  } else {
    return <img src={url} alt="fichier" className="mx-auto object-contain" />;
  }
};
export default UploadToIPFS;
