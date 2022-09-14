import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { ArrayRightIcon } from "../../../constants/icons";
import VoirPlus from "../../../components/VoidPlus";

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
  return {
    props: {
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const Relation = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <>
      <Workspace>
        <div className="w-full flex flex-col justify-around h-[300px] bg-base-200/50 py-3 pl-3">
          <div className="flex flex-row justify-between items-center">
            <h3>{text("recent")}</h3>
            <VoirPlus link="/workspace/relation/contracts" />
          </div>
          <div className="carousel carousel-center space-x-8">
            <ContractCard title="Contract 1" color="bg-pink-200"/>
            <ContractCard title="Contract 1" color="bg-purple-200"/>
            <ContractCard title="Contract 1" color="bg-orange-200"/>
            <ContractCard title="Contract 1" color="bg-red-200"/>
            <ContractCard title="Contract 1" color="bg-blue-200"/>
            <ContractCard title="Contract 1" color="bg-pink-200"/>
            <ContractCard title="Contract 1" color="bg-amber-200"/>
            <ContractCard title="Contract 1" color="bg-purple-200"/>
            <ContractCard title="Contract 1" color="bg-pink-200"/>
          </div>
        </div>
      </Workspace>
    </>
  );
};

type ContractCardProps = {
  color: string;
  title: string;
};
const ContractCard = ({ color, title }: ContractCardProps) => {
    const {t}=useTranslation()
  return (
    <div className="group rounded-sm carousel-item w-[180px] h-[200px] bg-base-100 transition-all duration-300 shadow-sm hover:shadow-md relative">
        <div className={`absolute rounded-sm  bottom-0 left-0 w-full h-2 ${color} flex justify-center items-center transition-all duration-300 group-hover:h-full`}>
    <span className="btn btn-sm dark:text-white glass opacity-0 delay-100 transition-all duration-300 group-hover:opacity-100"> {t('global.detail')}</span>
        </div>
    </div>
  );
};
export default Relation;
