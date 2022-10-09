import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import {  ReactNode } from "react";
import { AdminIcon, AdvanceIcon, SchoolIcon} from "../../../constants/icons";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { prisma } from "../../../server/db/client";
import General from "../../../partials/parametre/General";
import MembresRoles from "../../../partials/parametre/MembresRoles";
import Avance from "../../../partials/parametre/Avance";
import { FullUserContext } from "../../../utils/context";

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

  
 if(!context.query.tab){
    return {
        redirect:{
            destination:"/workspace/parametre/general",
            permanent:true
        }
    }
 }

 const utilisateur = await prisma.utilisateur
 .findUnique({
   where: {
     email: session?.user?.email || "",
   },
   include: {
     etablissement: true,
   },
 })
 .then((data) => JSON.parse(JSON.stringify(data)));
  return {
    props: {
      user:utilisateur,
      ...(await serverSideTranslations(context.locale||"", ["common"])),
    },
  };
};

type TTap = {
  title: string;
  route: string;
  icon: ReactNode;
  content: ReactNode;
};
const tabs: Array<TTap> = [
  {
    title: "general",
    route: "general",
    icon: <SchoolIcon className="text-xl lg:text-base" />,
    content: <General />,
  },
  {
    title: "membres et roles",
    route: "membres_roles",
    icon: <AdminIcon className="text-xl lg:text-base" />,
    content: <MembresRoles />,
  },
  {
    title: "avance",
    route: "avance",
    icon: <AdvanceIcon className="text-xl lg:text-base" />,
    content: <Avance />,
  },
];


const Etablissement = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const router = useRouter();
  const {user} = props
  const currentTab = router.query.tab;
  return (
    <FullUserContext.Provider value={user}>
      <Workspace breadcrumb={false}>
        <div className="p-3 lg:p-6">
          <div className="hidden lg:block">
            <Tabs />
          </div>
          <BottomNav />
         <div className="p-2 lg:pt-[50px] lg:p-4 max-w-3xl mx-auto">
         {tabs.filter((t) => t.route == currentTab)[0]?.content}
         </div>
        </div>
      </Workspace>
    </FullUserContext.Provider>
  );
};

const Tabs = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentTab = router.query.tab;

  return (
    <div className="tabs tabs-boxed max-w-4xl mx-auto py-3 px-5">
      {tabs.map((tab, i) => {
        return (
          <span
          key={i}
            onClick={() => {
              router.push(tab.route, undefined, { shallow: true });
            }}
            className={`tab w-1/3 ${
              currentTab == tab.route && "tab-active"
            } gap-3`}
          >
            {tab.icon}
            <span className="hidden lg:block">
              {t("workspace.parametre." + tab.title)}
            </span>
          </span>
        );
      })}
    </div>
  );
};

const BottomNav = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentTab = router.query.tab;

  return (
    <div className={`btm-nav z-50 transition-all lg:hidden`}>
      {tabs.map((tab, i) => {
        return (
          <button
          key={i}
            onClick={() => {
              router.push(tab.route, undefined, { shallow: true });
            }}
            className={` ${currentTab == tab.route && "active text-primary"}`}
          >
            {tab.icon}
            <span className="btm-nav-label text-[12px]">
              {t("workspace.parametre." + tab.title)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
export default Etablissement;