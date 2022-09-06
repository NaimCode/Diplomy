import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { LogoBrand } from "../components/Logo";
import MyLottie from "../components/MyLottie";
import { ChartIcon, DiplomaIcon, HomeIcon, PeopleIcon, SettingIcon, ShakeIcon, TelIcon} from "../constants/icons";
import animationData from "../../public/lotties/support.json"
import animationDataDark from "../../public/lotties/support_dark.json"
import { useTheme } from "next-themes";
import useWindowDimensions from "../utils/hooks";
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
  {
    title: "plus",
    children: [
      {
        title: "activites",
        route: "/activites",
        icon: <ChartIcon className="text-lg" />,
      },
      {
        title: "parametre",
        route: "/parametre",
        icon: <SettingIcon className="text-lg" />,
      },
    ],
  },
];
const SideBar = () => {
  const router = useRouter();
  const { t } = useTranslation();


  return (
    <section className="flex flex-col w-[300px] bg-base-200 p-2 md:px-6 overflow-hidden">
        
      <div className="nav justify-center hidden lg:flex">
        <LogoBrand />
      </div>
      <div className="p-3 hidden lg:block" />
      <ul className="menu w-full p-2 rounded-box gap-1 overflow-scroll">
        {menu.map((m, i) => {
          return (
            <>
              <li key={"menu"+i.toString()} className="menu-title pt-2 lg:pt-3">
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
    <Contact/>
    </section>
  );
};

const Contact=()=>{
    const { t } = useTranslation();
    const {theme}=useTheme()
    const [isDark, setisDark] = useState(theme=="dark")
    useEffect(() => {
      setisDark(theme=="dark")
    }, [theme])
  
    const { height, width } = useWindowDimensions();
    return   <div className={`flex flex-col items-center gap-1 lg:gap-2 lg:translate-y-3`}>
    <div className={`${height!<=900 &&"hidden lg:block h-[200px] w-[200px]"} `}>

    <MyLottie animationData={isDark?animationDataDark: animationData}/>
    </div>
    <button className="-translate-y-4 lg:-translate-y-8 btn btn-sm btn-accent no-animation gap-2">
        <TelIcon className="lg:hidden text-xl"/>
        {t("workspace.sidebar.contact")}
    </button>
</div>
}
export default SideBar;
