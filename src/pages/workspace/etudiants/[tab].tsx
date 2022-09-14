import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { ReactNode } from "react";
import { CheckIcon, ListIcon, WaitingIcon } from "../../../constants/icons";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import ListInitiale from "../../../partials/etudiants/ListInitiale";
import Certifies from "../../../partials/etudiants/Certifies";
import Attente from "../../../partials/etudiants/Attente";

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

type TTap = {
  title: string;
  route: string;
  icon: ReactNode;
  content: ReactNode;
};
const tabs: Array<TTap> = [
  {
    title: "liste initiale",
    route: "initiale",
    icon: <ListIcon className="text-xl lg:text-base" />,
    content: <ListInitiale />,
  },
  {
    title: "en attente",
    route: "attente",
    icon: <WaitingIcon className="text-xl lg:text-base" />,
    content: <Attente />,
  },
  {
    title: "certifie",
    route: "certifies",
    icon: <CheckIcon className="text-xl lg:text-base" />,
    content: <Certifies />,
  },
];
const Etablissement = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const router = useRouter();
  const currentTab = router.query.tab;

  return (
    <>
      <Workspace breadcrumb={false}>
        <div className="p-3 lg:p-6">
          <div className="hidden lg:block">
            <Tabs />
          </div>
          <BottomNav />
          {tabs.filter((t) => t.route == currentTab)[0]?.content}
        </div>
      </Workspace>
    </>
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
            onClick={() => {
              router.push(tab.route, undefined, { shallow: true });
            }}
            className={`tab w-1/3 ${
              currentTab == tab.route && "tab-active"
            } gap-3`}
          >
            {tab.icon}
            <span className="hidden lg:block">
              {t("workspace.etudiant." + tab.title)}
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
    <div className={`btm-nav transition-all lg:hidden`}>
      {tabs.map((tab, i) => {
        return (
          <button
            onClick={() => {
              router.push(tab.route, undefined, { shallow: true });
            }}
            className={` ${currentTab == tab.route && "active text-primary"}`}
          >
            {tab.icon}
            <span className="btm-nav-label text-[12px]">
              {t("workspace.etudiant." + tab.title)}
            </span>
          </button>
        );
      })}
    </div>
  );
};
export default Etablissement;
