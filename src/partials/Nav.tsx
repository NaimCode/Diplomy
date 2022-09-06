import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { useContext } from "react";
import { Badge } from "rsuite";
import ThemeSwitcher from "../components/ ThemeSwitcher";
import DrawerMenu from "../components/DrawerMenu";
import LanguageChanger from "../components/LanguageChanger";
import { LogoBrand } from "../components/Logo";
import { MenuIcon, NotifIcon, SettingIcon } from "../constants/icons";

const Nav = () => {
  const { data: session } = useSession();

  return (
    <div className="nav top-0 left-0 sticky justify-between shadow-sm backdrop-blur-sm bg-base-100/80">
     <DrawerMenu/>
     <div className="lg:hidden">
     <LogoBrand/>
     </div>
      <div  className="hidden lg:flex flex-grow" />
      <NotifButton />
      <div className={"hidden lg:flex flex-row items-center"}>
      <ThemeSwitcher/>
      <LanguageChanger/>
     
    
      <AvatarButton session={session} />
      </div>
      {/* <div className="divider divider-horizontal mx-0"></div> */}

      {/* <ThemeSwitcher />
        <LanguageChanger /> */}
    </div>
  );
};

const NotifButton = () => {
  const {t}=useTranslation()
  return (


<div className="tooltip tooltip-bottom" data-tip={t("workspace.nav.notifications")}>
<span className="btn btn-ghost">
      {/* <Badge color="red">
          <NotifIcon className="icon" />
        </Badge> */}
      <NotifIcon className="icon" />
    </span>
</div>
 
  );
};
const SettingButton = () => {
  const {t}=useTranslation()
  return (
    <div className="tooltip tooltip-bottom" data-tip={t("workspace.nav.parametres")}>

    <span className="btn btn-ghost group">
      <SettingIcon className="icon transition-all duration-300 group-hover:rotate-[30%]" />
    </span>
    </div>
  );
};

const AvatarButton = ({ session }: { session?: Session| null }) => {
  const {t}=useTranslation()
  return (
    <div className="tooltip tooltip-bottom" data-tip={t("workspace.nav.profil")}>

    <div className="avatar cursor-pointer">
      <div className="w-[40px] lg:w-[50px] mask mask-squircle ">
       {session &&  <Image src={session.user!.image!} alt="photo" layout="fill" />}
      </div>
    </div>
    </div>
  );
};
export default Nav;
