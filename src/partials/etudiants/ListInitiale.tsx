import { Etudiant, Formation } from "@prisma/client";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useTranslation } from "next-i18next";
import router from "next/router";
import { useContext, useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { MdUpdate, MdVisibility } from "react-icons/md";
import { toast } from "react-toastify";
import InputForm from "../../components/InputForm";
import { AddIcon, DeleteIcon, EditIcon } from "../../constants/icons";
import { FullUserContext } from "../../utils/context";
import { isVirtuel } from "../../utils/functions";
import { trpc } from "../../utils/trpc";

const ListInitiale = () => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.etudiant." + s);
  const utilisateur = useContext(FullUserContext);
  const [etudiant, setetudiant] = useState();
  const { data, isLoading, refetch } = trpc.useQuery([
    "etudiant.get",
    {
      etablissemntId: utilisateur.etablissementId,
      tab: "initial",
    },
  ]);

  return (
    <>
      <div className="py-3 lg:py-8  lg:px-6">
        <div className="flex flex-row justify-between py-4 lg:py-6">
          <h1 className="text-xl lg:text-4xl">
            {t("workspace.sidebar.etudiants")}
          </h1>
          <a href="#add">
            <button className="btn  btn-primary gap-2 btn-sm lg:btn-md">
              <AddIcon className="text-xl" />
              {t("global.ajouter")}
            </button>
          </a>
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
      <DialogAdd refetch={refetch} />
      {etudiant && <DialogUpdate refetch={refetch} etudiant={etudiant} />}
    </>
  );
};

export default ListInitiale;

type EtudiantInputType = {
  nom: string;
  prenom: string;
  email: string;
  formationId: string;
};
const DialogAdd = ({ refetch }: { refetch: any }) => {
  const { etablissement } = useContext(FullUserContext);
  const [formation, setformation] = useState<string | undefined>();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EtudiantInputType>();
  const { mutate: add } = trpc.useMutation(["etudiant.add"], {
    onError: (err) => {
      toast.error(t("global.toast erreur"));
      console.log("err", err);
    },
    onSuccess: () => {
    const {formations}=etablissement
    const f=formations.filter((e:Formation)=>e.id==formation)[0]
    const is=isVirtuel(f)
    console.log(is);
    
      if(is){
        toast.info(t("workspace.etudiants.virtuel formation"));
      }else{
        toast.success(t("global.toast succes"));
      }
   
      router.back();
      refetch();
      reset();
     
    },
  });


  const { t } = useTranslation();

  const text = (s: string) => t("workspace.etudiants." + s);
  const onSubmit = (data: any) =>
    add({ ...data, formationId: formation, etablissemntId: etablissement.id });

  return (
    <div className="modal" id="add">
      <form onSubmit={handleSubmit(onSubmit)} className="modal-box">
        <h3 className="font-bold text-lg">{text("nouveau etudiant")}</h3>
        <div className="py-3 lg:py-6 space-y-3">
          <div className="flex flex-row gap-3">
            <InputForm
              register={register("prenom", { required: true })}
              error={errors.prenom}
              placeholder={t("workspace.etudiants.prenom")}
              containerClass="w-full"
            />
            <InputForm
              register={register("nom", { required: true })}
              error={errors.nom}
              placeholder={t("workspace.etudiants.nom")}
              containerClass="w-full"
            />
          </div>
          <InputForm
            type="email"
            register={register("email", { required: true })}
            error={errors.email}
            placeholder={t("inscription.email")}
            containerClass="w-full"
          />
        </div>
        <select
          value={formation}
          onChange={(e) => setformation(e.target.value)}
          className="select w-full"
        >
          {etablissement.formations.map((e: any, i: number) => {
            return (
              <option value={e.id} key={i} className="truncate">
                {e.intitule}
              </option>
            );
          })}
        </select>
        <div className="modal-action">
          <a href="#" className="btn btn-ghost">
            {t("global.dialog cancel")}
          </a>
          <button type="submit" className="btn">
            {t("global.ajouter")}
          </button>
        </div>
      </form>
    </div>
  );
};

type TableProps = {
  data: Array<Etudiant>;
  formations: Array<Formation>;
  refetch: any;
  setEtudiant: any;
};

const Table = ({ data, formations, refetch, setEtudiant }: TableProps) => {
  const { t } = useTranslation();
  const columnsHelper = createColumnHelper<Etudiant>();
  const { mutate: deleteEtudiant } = trpc.useMutation(["etudiant.delete"], {
    onError: (err) => {
      console.log("err", err);
      toast.error(t("global.toast erreur"));
    },
    onSuccess: () => {
      refetch();
      toast.success(t("global.toast succes"));
    },
  });
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
            const formation = formations.filter(
              (f) => f.id == row.renderValue("formationId")
            )[0];
            const link = `/workspace/formations/${formation?.intitule!}`;

            return (
              <tr key={row.id} className={"relative group"}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
             
                <div
                  key={10000}
                  className="gap-3 px-2 group-hover:flex flex-row lg:justify-center items-center absolute top-0 left-0 h-full w-full hidden z-30 bg-base-100/80 backdrop-blur-sm translate-x-full group-hover:translate-x-0 transition-all duration-500"
                >
                  <button
                    onClick={() => {
                      deleteEtudiant(row.original.id);
                    }}
                    className="btn btn-error btn-sm btn-outline gap-2"
                  >
                    <DeleteIcon className="text-lg" />
                    {t("global.supprimer")}
                  </button>

               
                    <a
                    href="#update"
                    onClick={() => {
                      console.log('click');
                      
                      setEtudiant(row.original);
                    }}className="btn btn-info btn-sm btn-outline gap-2">
                      <EditIcon className="text-lg" />
                      {t("global.modifier")}
                    </a>
                  
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

const DialogUpdate = ({
  refetch,
  etudiant,
}: {
  refetch: any;
  etudiant: Etudiant;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<EtudiantInputType>({
    defaultValues: etudiant,
  });
  const { mutate: update } = trpc.useMutation(["etudiant.update"], {
    onError: (err) => {
      toast.error(t("global.toast erreur"));
      console.log("err", err);
    },
    onSuccess: () => {
      refetch();
      toast.success(t("global.toast succes"));
      reset();
      router.back();
    },
  });

  const [formation, setformation] = useState(etudiant.formationId);
  const { t } = useTranslation();
  const { etablissement } = useContext(FullUserContext);
  const text = (s: string) => t("workspace.etudiants." + s);
  const onSubmit = (data: any) =>
    update({ id: etudiant.id, data: { ...data, formationId: formation } });
    useEffect(() => {
      reset(etudiant)
    }, [etudiant])
    
  return (
    <div className="modal" id="update">
      <form onSubmit={handleSubmit(onSubmit)} className="modal-box">
        <h3 className="font-bold text-lg">{text("nouveau etudiant")}</h3>
        <div className="py-3 lg:py-6 space-y-3">
          <div className="flex flex-row gap-3">
            <InputForm
              register={register("prenom", { required: true })}
              error={errors.prenom}
              placeholder={t("workspace.etudiants.prenom")}
              containerClass="w-full"
            />
            <InputForm
              register={register("nom", { required: true })}
              error={errors.nom}
              placeholder={t("workspace.etudiants.nom")}
              containerClass="w-full"
            />
          </div>
          <InputForm
            type="email"
            register={register("email", { required: true })}
            error={errors.email}
            placeholder={t("inscription.email")}
            containerClass="w-full"
          />
        </div>
        <select
          value={formation}
          onChange={(e) => setformation(e.target.value)}
          className="select w-full"
        >
          {etablissement.formations.map((e: any, i: number) => {
            return (
              <option value={e.id} key={i} className="truncate">
                {e.intitule}
              </option>
            );
          })}
        </select>
        <div className="modal-action">
          <a href="#" className="btn btn-ghost">
            {t("global.dialog cancel")}
          </a>
          <button type="submit" className="btn">
            {t("global.modifier")}
          </button>
        </div>
      </form>
    </div>
  );
};
