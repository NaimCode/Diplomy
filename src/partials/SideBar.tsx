import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { LogoBrand } from "../components/Logo";
import MyLottie from "../components/MyLottie";
import { DiplomaIcon, HomeIcon, PeopleIcon, ShakeIcon} from "../constants/icons";
import animationData from "../../public/lotties/support.json"
import animationDataDark from "../../public/lotties/support_dark.json"
import { useTheme } from "next-themes";
type TMenuItem = {
  title: string;
  route: string;
  icon: ReactNode;
};

type TMenu = {
  title: string;
  children: Array<TMenuItem>;
};

const menu: Array<TMenu> = [
  {
    title: "general",
    children: [
      {
        title: "etablissement",
        route: "/etablissement",
        icon: <HomeIcon className="text-lg" />,
      },
      {
        title: "relation",
        route: "/relation",
        icon: <ShakeIcon className="text-lg" />,
      },
    ],
  },
  {
    title: "gestion",
    children: [
      {
        title: "formations",
        route: "/formations",
        icon: <DiplomaIcon className="text-lg" />,
      },
      {
        title: "etudiants",
        route: "/etudiants",
        icon: <PeopleIcon className="text-lg" />,
      },
    ],
  },
];
const SideBar = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const {theme}=useTheme()
  const [isDark, setisDark] = useState(theme=="dark")
  useEffect(() => {
    setisDark(theme=="dark")
  }, [theme])
  
  return (
    <section className="hidden lg:flex flex-col sticky top-0 left-0 h-screen w-[300px] bg-base-200 px-6">
      <div className="nav justify-center">
        <LogoBrand />
      </div>
      <div className="p-3" />
      <ul className="menu w-full p-2 rounded-box gap-1">
        {menu.map((m, i) => {
          return (
            <>
              <li key={"menu"+i.toString()} className="menu-title pt-3">
                <span>{t("workspace.sidebar." + m.title)}</span>
              </li>
              {m.children.map((c, i) => {
                return (
                  <li key={i}>
                    <button
                    onClick={()=>{
                        router.push("/workspace/"+c.route)
                    }}
                      className={`font-semibold ${
                        router.asPath.includes(c.route) && "active"
                      }`}
                    >
                      {c.icon}
                      {t("workspace.sidebar." + c.title)}
                    </button>
                  </li>
                );
              })}
            </>
          );
        })}
      </ul>
      <div className="flex-grow"></div>
      <div className="flex flex-col items-center gap-2">
          <MyLottie animationData={isDark?animationDataDark: animationData}/>
          <button className="-translate-y-8 btn btn-sm btn-accent no-animation">
              {t("workspace.sidebar.contact")}
          </button>
      </div>
    </section>
  );
};

export default SideBar;
