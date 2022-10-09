/* eslint-disable @typescript-eslint/no-explicit-any */
import { Etudiant, Formation } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { useContext, useState } from "react";

import { FullUserContext } from "../../utils/context";
import { GATEWAY_IPFS, useHasMetaMask } from "../../utils/hooks";
import { trpc } from "../../utils/trpc";

const Attente = () => {
  const { t } = useTranslation();
  const utilisateur = useContext(FullUserContext);
  const [ setetudiant] = useState();
  const { data, isLoading, refetch } = trpc.useQuery([
    "etudiant.get",
    {
      etablissemntId: utilisateur.etablissementId,
      tab: "attente",
    },
  ]);

  return (
    <>
      <div className="py-3 lg:py-8  lg:px-6">
        <div className="flex flex-row justify-between py-4 lg:py-6">
          <h1 className="text-xl lg:text-4xl">
            {t("workspace.etudiants.en attente")}
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
<DialogNoMetaMask/>
      
    </>
  );
};

export default Attente;

export const DialogNoMetaMask=()=>{
  const {t}=useTranslation()
  return <div className="modal" id="no_meta_mask">
  <div className="modal-box">
    <h3 className="font-bold text-lg">
      {t("workspace.etudiants.erreur metamask")}
    </h3>
    <p className="py-4">{t("workspace.etudiants.no meta mask body")}</p>
    <a
    rel="noreferrer"
      target={"_blank"}
      href="https://medium.com/@alias_73214/guide-how-to-setup-metamask-d2ee6e212a3e"
    >
      {t("workspace.etudiants.pour plus d'info")}
    </a>
    <div className="modal-action">
      <a href="#" className="btn btn-ghost">
        {t("global.annuler")}
      </a>
      <a
      rel="noreferrer"
        target={"_blank"}
        href="https://metamask.io/"
        className="btn btn-outline btn-warning"
      >
        {t("workspace.etudiants.telecharger meta mask")}
      </a>
    </div>
  </div>
</div>
}



type TableProps = {
  data: Array<Etudiant>;
  formations: Array<Formation>;
  refetch: any;
  setEtudiant: any;
};

const Table = ({ data, formations }: TableProps) => {
  const { t } = useTranslation();
  const hasMeta = useHasMetaMask();
  const columnsHelper = createColumnHelper<Etudiant>();

  const columns = [
    {
      header: "Action",
      cell: (etudiant: any) =>
        hasMeta ? (
          <button
            onClick={() => {
              router.push("/certifier/" + etudiant.cell.row.original.id);
            }}
            className="btn btn-sm"
          >
            {t("global.finaliser")}
          </button>
        ) : (
          <a href="#no_meta_mask" className="btn btn-sm">
            {t("global.finaliser")}
          </a>
        ),
    },
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
          <a rel="noreferrer" target={"_blank"} href={GATEWAY_IPFS + hash} className="text-sm">
            {hash}
          </a>
        );
      },
    }),
    columnsHelper.accessor("formationId", {
      header: () => t("workspace.etudiants.table formation"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        return formations.filter((f) => f.id == e.formationId)[0]?.intitule;
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
