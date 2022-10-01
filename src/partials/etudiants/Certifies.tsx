import { Etudiant, Formation, Transaction } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ethers } from "ethers";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { useContext, useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { MdUpdate, MdVisibility } from "react-icons/md";
import { toast } from "react-toastify";
import InputForm from "../../components/InputForm";
import {
  AddIcon,
  CodeQRIcon,
  CopyIcon,
  DeleteIcon,
  EditIcon,
} from "../../constants/icons";
import { FullUserContext } from "../../utils/context";
import { isVirtuel } from "../../utils/functions";
import { GATEWAY_IPFS, useHasMetaMask, useQR } from "../../utils/hooks";
import { trpc } from "../../utils/trpc";
import UploadToIPFS from "../uploadToIPFS";

const Certifies = () => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.etudiant." + s);
  const utilisateur = useContext(FullUserContext);
  const [etudiant, setetudiant] = useState();
  const { data, isLoading, refetch } = trpc.useQuery([
    "etudiant.get",
    {
      etablissemntId: utilisateur.etablissementId,
      tab: "certifies",
    },
  ]);

  return (
    <>
      <div className="py-3 lg:py-8  lg:px-6">
        <div className="flex flex-row justify-between py-4 lg:py-6">
          <h1 className="text-xl lg:text-4xl">
            {t("workspace.etudiant.certifie")}
          </h1>
        </div>
        {isLoading ? (
          <div className="py-6 flex justify-center items-center">
            <button className="btn btn-ghost loading btn-xl"></button>
          </div>
        ) : (
          <div>
            <Table
              refetch={refetch}
              setEtudiant={setetudiant}
              data={data || []}
              formations={utilisateur.etablissement.formations}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Certifies;

type EtudiantInputType = {
  nom: string;
  prenom: string;
  email: string;
  formationId: string;
};

type TableProps = {
  data: Array<Etudiant & { transaction: Transaction }>;
  formations: Array<Formation>;
  refetch: any;
  setEtudiant: any;
};

const Table = ({ data, formations, refetch, setEtudiant }: TableProps) => {
  const { t } = useTranslation();
  const columnsHelper = createColumnHelper<
    Etudiant & { transaction: Transaction }
  >();
  const qr = useQR();
  const columns = [
    columnsHelper.accessor("id", {
      header: () => t("global.action"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        return (
          <div className="flex-row gap-3 items-center flex">
            <button onClick={()=>qr.toClipboardHash(e.transaction.hash)} className="btn btn-warning btn-sm lg:btn-md">
              <CopyIcon className="icon"/>
            </button>
         
            <a
              target={"_blank"}
              href={qr.generate(e.transaction.hash)}
              className="btn btn-outline btn-sm lg:btn-md"
            >
              <CodeQRIcon className="icon" />
            </a>
          </div>
        );
      },
    }),
    columnsHelper.accessor("nom", {
      header: () => t("workspace.sidebar.etudiants"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        return (
          <div className="flex flex-col">
            <h6>{e.prenom + " " + e.nom}</h6>
            <span>{e.email}</span>
          </div>
        );
      },
    }),
    columnsHelper.accessor("documentId", {
      header: () => t("global.hash doc"),
      cell: (etudiant: any) => {
        const hash = etudiant.row.original.document.hash;
        //
        //
        //
        return (
          <a target={"_blank"} href={GATEWAY_IPFS + hash} className="text-sm">
            <p className="max-w-[130px] lg:max-w-[160px] truncate">{hash}</p>
          </a>
        );
      },
    }),
    columnsHelper.accessor("formationId", {
      header: () => t("workspace.etudiants.table formation"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        const formation = formations.filter(
          (f) => f.id == e.formationId
        )[0];
        const link = `/workspace/formations/${formation?.intitule!}`;

        return <a href={link}><p className="max-w-[150px] truncate">{formations.filter((f) => f.id == e.formationId)[0]?.intitule}</p></a>;
      },
    }),
    columnsHelper.accessor("transaction", {
      header: () => t("workspace.etudiants.table hash"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        return (
          <p className="max-w-[130px] lg:max-w-[160px] truncate">
            {e.transaction.hash}
          </p>
        );
      },
    }),


  ];
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            // const formation = formations.filter(
            //   (f) => f.id == row.renderValue("formationId")
            // )[0];
            // const link = `/workspace/formations/${formation?.intitule!}`;

            return (
              <tr key={row.id} className={"relative group"}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {data.length == 0 && (
        <div className="flex flex-row justify-center items-center label-text p-2 lg:p-4">
          {t("global.liste vide")}
        </div>
      )}
    </div>
  );
};
