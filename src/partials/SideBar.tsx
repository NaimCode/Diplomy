import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import { LogoBrand } from "../components/Logo";
import { DiplomaIcon, HomeIcon, PeopleIcon} from "../constants/icons";

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
              <li className="menu-title pt-3">
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
        {/* <li className="menu-title">
    <span>Category</span>
  </li>
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li>
  <li className="menu-title">
    <span>Category</span>
  </li>
  <li><a>Item 1</a></li>
  <li><a>Item 2</a></li> */}
      </ul>
    </section>
  );
};

export default SideBar;
