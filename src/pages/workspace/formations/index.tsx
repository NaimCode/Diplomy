/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { AddIcon } from "../../../constants/icons";
import { prisma } from "../../../server/db/client";
import { Formation } from ".prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import router from 'next/router'
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
  const utilisateur = await prisma.utilisateur
    .findUnique({
      where: {
        email: session?.user?.email||"",
      },
      include: {
        etablissement: {
          include: {
            formations: true,
          },
        },
      },
    })
    .then((data) => JSON.parse(JSON.stringify(data)));

  return {
    props: {
      etablissement: utilisateur.etablissement,

      ...(await serverSideTranslations(context.locale||"", ["common"])),
    },
  };
};

const Formations = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { formations } = props.etablissement;
  const { t } = useTranslation();

  return (
    <>
      <Workspace>
        <div className="px-4 lg:px-6">
          <div className="flex flex-row justify-between py-4 lg:py-6">
            <h1 className="text-xl lg:text-4xl">
              {t("workspace.sidebar.formations")}
            </h1>
            <Link href="/workspace/formations/ajouter">
              <button className="btn  btn-primary gap-2 btn-sm lg:btn-md">
                <AddIcon className="text-xl" />
                {t("global.ajouter")}
              </button>
            </Link>
          </div>
          <Table data={formations.reverse()} />
        </div>
      </Workspace>
    </>
  );
};

type TableProps = {
  data: Array<any>;
};
const Table = ({ data }: TableProps) => {
  const columnsHelper = createColumnHelper<Formation>();
  const columns = [
    columnsHelper.accessor("intitule", {
      header: () => "Intitulé",
    }),
    columnsHelper.accessor("version", {
      header: () => "version",

      cell: (formation) => {
        return formation.cell.row.original.peutAvoirVersion ? (
          <div className="badge badge-warning">{formation.getValue()}</div>
        ) : (
          <div className="badge badge-secondary">Sans version</div>
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
                  className={header.id == "version" ? "text-center" : ""}
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
            <tr key={row.id} onClick={()=>router.push('/workspace/formations/'+row.original.intitule)} className=" hover:active cursor-pointer">
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={cell.column.id == "version" ? "text-center" : ""}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Formations;
