import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useTranslation } from "next-i18next";

const ListInitiale = () => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.etudiant." + s);
  return (
    <div className="py-3 lg:py-8">
      <h1 className="text-center text-xl lg:text-4xl">{text("init list etudiants")}</h1>
      <div className="divider"></div>
    </div>
  );
};

export default ListInitiale;
type TableProps = {
    data: Array<any>;
  };
  
  const Table = ({ data }: TableProps) => {
    const { t } = useTranslation()
    const columnsHelper = createColumnHelper<any>();
    const columns = [
      columnsHelper.accessor("intitule", {
        header: () => t('workspace.formation.intitule'),
      }),
      columnsHelper.accessor("versionnage", {
        header: () => t('workspace.formation.version'),
  
        cell: (formation) => {
          return formation.cell.row.original.versionnage ? (
            <div className="badge badge-warning">{formation.cell.row.original.versions.at(-1)?.numero}</div>
          ) : (
            <div className="badge badge-secondary">{t('workspace.formation.sans version')}</div>
          );
        },
      }),
    ];
    const table = useReactTable({
      columns,
      data,
      getCoreRowModel: getCoreRowModel(),
    });
    //table-compact for small rows
  
    return (
      <div className="overflow-x-auto">
        <table className="table w-full table-zebra">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={header.id == "versionnage" ? "text-center" : ""}
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
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className=" hover:active cursor-pointer">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cell.column.id == "versionnage" ? "text-center" : ""}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        {
          data.length == 0 && <div className="flex flex-row justify-center items-center label-text p-2 lg:p-4">
            {t('global.liste vide')}
          </div>
        }
      </div>
    );
  };