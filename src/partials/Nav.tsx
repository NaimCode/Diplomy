import { useTranslation } from "next-i18next";
import ThemeSwitcher from "../components/ThemeSwitcher";
import AvatarButton from "../components/Avatar";
import DrawerMenu from "../components/DrawerMenu";
import LanguageChanger from "../components/LanguageChanger";
import { LogoBrand } from "../components/Logo";
import { NotifIcon } from "../constants/icons";
import {useRouter} from 'next/router'

const Nav = () => {
 const router=useRouter()
const hasBack=router.asPath.split("/")[3]

return (
    <div className="nav top-0 left-0 sticky justify-between shadow-sm backdrop-blur-sm bg-base-100/80 z-40">
    <div className={`hidden ${hasBack&&"lg:flex"}`}>
    {/* <Back/> */}
    </div>
     <DrawerMenu/>
     <div className="lg:hidden">
     <LogoBrand/>
     </div>
      <div  className="hidden lg:flex flex-grow" />
      <NotifButton />
      <div className={"hidden lg:flex flex-row items-center"}>
      <ThemeSwitcher/>
      <LanguageChanger/>
     
    
      <AvatarButton />
      </div>
 
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



export default Nav;
