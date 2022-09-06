import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { LanguageIcon, ExpandMoreIcon } from "../constants/icons";

const LanguageChanger = () => {
    type TLang = {
      title: string;
      icon: string;
      locale: string;
    };
    const langs: Array<TLang> = [
      {
        title: "Français",
        icon: "fr",
        locale: "fr",
      },
      {
        title: "English",
        icon: "gb",
        locale: "en",
      },
   
      {
        title: "العربية",
        icon: "ma",
        locale: "ar",
      },
    ];
    const router = useRouter();
    useEffect(() => {
      const dir = router.locale == "ar" ? "rtl" : "ltr";
      const lang = router.locale == "ar" ? "ar" : "en";
      document.querySelector("html")?.setAttribute("dir", dir);
      document.querySelector("html")?.setAttribute("lang", lang);
    }, [router.locale]);
  const {t}=useTranslation()
    const { locale: activeLocale, pathname, query, asPath } = router;
    return (
      <div className="tooltip  tooltip-bottom" data-tip={t("global.langue")}>

      <div className="dropdown dropdown-end font-semibold">
        <label tabIndex={0} className="btn btn-ghost m-1 ">
          <LanguageIcon className="icon" />
          <ExpandMoreIcon className="icon" />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-52 gap-2"
          >
          {langs.map((l, i) => {
            const {title, icon,locale}=l
            return (
              <li  key={i}>
              <Link href={{ pathname, query }} as={asPath} locale={locale}>
                <span className={`justify-start ${activeLocale==locale&&'active'}`}>
                  <span className={`fi fi-${icon}`}></span>
                  {title}
                </span>
              </Link>
              </li>
            );
          })}
        </ul>
      </div>
          </div>
    );
  };

  export default LanguageChanger