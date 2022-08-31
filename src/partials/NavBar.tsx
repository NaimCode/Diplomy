import { signIn } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import LanguageChanger from "../components/LanguageChanger";

import Logo from "../components/Logo";
import { FileIcon} from "../constants/icons";


const NavBar = () => {
const handleSignIn=()=>{
  signIn('google').then(()=>{}).catch((err)=>{
    console.log(err)
  })
}
  const { t } = useTranslation();
  return (
    <div className="navbar bg-base-100 sticky top-0 left-0">
      <div
        className={`container max-w-7xl mx-auto h-full flex flex-row items-center justify-between gap-3`}
      >
        <Logo />
        <div className="flex-grow"></div>
       <LanguageChanger/>
        <Link href="/inscription">
          <button className="btn btn-outline gap-2">
            <FileIcon className="icon" />
            {t('home.Button inscription')}
          </button>
        </Link>
        <button onClick={handleSignIn} className="btn btn-primary">
          {t("home.Button workspace")}
        </button>
      </div>
    </div>
  );
};


export default NavBar;
