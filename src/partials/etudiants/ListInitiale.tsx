import { Etudiant, Formation } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import router from "next/router";
import { useContext, useEffect } from "react";
import { CgCornerDownRight, CgEditBlackPoint } from "react-icons/cg";
import { MdUpdate, MdVisibility } from "react-icons/md";
import { AddIcon, DeleteIcon, EditIcon } from "../../constants/icons";
import { FullUserContext } from "../../utils/context";
import { trpc } from "../../utils/trpc";

const ListInitiale = () => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.etudiant." + s);
  const utilisateur = useContext(FullUserContext);

  const { data, isLoading } = trpc.useQuery([
    "etudiant.get",
    {
      etablissemntId: utilisateur.etablissementId,
      tab: "initial",
    },
  ]);

  return (
    <div className="py-3 lg:py-8  lg:px-6">
      <div className="flex flex-row justify-between py-4 lg:py-6">
        <h1 className="text-xl lg:text-4xl">
          {t("workspace.sidebar.etudiants")}
        </h1>
        <Link href="/workspace/formations/ajouter">
          <button className="btn  btn-primary gap-2 btn-sm lg:btn-md">
            <AddIcon className="text-xl" />
            {t("global.ajouter")}
          </button>
        </Link>
      </div>
      {isLoading ? (
        <div className="py-6 flex justify-center items-center">
          <button className="btn btn-ghost loading btn-xl"></button>
        </div>
      ) : (
        <div>
          <Table
            data={data || []}
            formations={utilisateur.etablissement.formations}
          />
        </div>
      )}
    </div>
  );
};

export default ListInitiale;

type EtudiantCardProps = {
  etudiant: Etudiant;
};
const EtudiantCard = ({ etudiant }: EtudiantCardProps) => {
  return (
    <div className="rounded-lg shadow-sm p-2 lg:p-6 border-[1px] border-base-300">
      <div>
        <h6>
          {etudiant.prenom} {etudiant.nom}
        </h6>
        <p>{etudiant.email}</p>
      </div>
    </div>
  );
};

type TableProps = {
  data: Array<Etudiant>;
  formations: Array<Formation>;
};

const Table = ({ data, formations }: TableProps) => {
  const { t } = useTranslation();
  const columnsHelper = createColumnHelper<Etudiant>();
  const columns = [
    columnsHelper.accessor("nom", {
      header: () => t("workspace.etudiants.table nom"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        return <h6>{e.prenom + " " + e.nom}</h6>;
      },
    }),

    columnsHelper.accessor("email", {
      header: () => t("inscription.email"),
    }),
    columnsHelper.accessor("formationId", {
      header: () => t("workspace.etudiants.table formation"),
      cell: (etudiant) => {
        const e = etudiant.cell.row.original;
        return formations.filter((f) => f.id == e.formationId)[0]?.intitule;
      },
    }),
    // columnsHelper.accessor("email", {
    //   header: () => t('workspace.formation.version'),

    //   cell: (formation) => {
    //     return formation.cell.row.original.versionnage ? (
    //       <div className="badge badge-warning">{formation.cell.row.original.versions.at(-1)?.numero}</div>
    //     ) : (
    //       <div className="badge badge-secondary">{t('workspace.formation.sans version')}</div>
    //     );
    //   },
    // }),
  ];
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
  });
  //table-compact for small rows

  return (
    <div className="overflow-x-auto">
      <table className="table w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  // className={header.id == "versionnage" ? "text-center" : ""}
                >
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
            const formation = formations.filter(
              (f) => f.id == row.renderValue("formationId")
            )[0];
            const link =
              `/workspace/formations/${formation?.intitule!}`;
            return (
              <tr key={row.id} className={"relative group"}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
                <div className="gap-3 px-2 group-hover:flex flex-row lg:justify-center items-center absolute top-0 left-0 h-full w-full hidden z-30 bg-base-100/80 backdrop-blur-sm translate-x-full group-hover:translate-x-0 transition-all duration-500">
                  <button className="btn btn-error btn-sm btn-outline gap-2">
                    <DeleteIcon className="text-lg" />
                    {t("global.supprimer")}
                  </button>

                  <button className="btn btn-info btn-sm btn-outline gap-2">
                    <EditIcon className="text-lg" />
                    {t("global.modifier")}
                  </button>
                  <div className="divider divider-horizontal py-4"></div>

                  <button
                    onClick={() => router.push(link)}
                    className="btn btn-sm btn-outline gap-2"
                  >
                    <MdVisibility className="text-lg" />
                    {t("workspace.etudiants.detail formation")}
                  </button>
                </div>
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
