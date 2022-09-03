import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Badge } from "rsuite";
import { NotifIcon, SettingIcon } from "../constants/icons";

const Nav = () => {
    const {data:session}=useSession()
    return (
      <div className="nav top-0 left-0 sticky justify-between shadow-sm backdrop-blur-sm bg-base-100/80">
        <div className="flex-grow" />
        <NotifButton />
        <SettingButton/>
        <div className="px-2"></div>
        <AvatarButton session={session!}/>
        {/* <div className="divider divider-horizontal mx-0"></div> */}
  
        {/* <ThemeSwitcher />
        <LanguageChanger /> */}
      </div>
    );
  };
  
  const NotifButton = () => {
    return (
      <span className="btn btn-ghost">
        {/* <Badge color="red">
          <NotifIcon className="icon" />
        </Badge> */}
          <NotifIcon className="icon" />
      </span>
    );
  };
  const SettingButton=()=>{
    return <span className="btn btn-ghost group">
      <SettingIcon className="icon transition-all duration-300 group-hover:rotate-45"/>
    </span>
  }

 const AvatarButton=({session}:{session:Session})=>{
return <div  className="avatar cursor-pointer">
<div className="w-[50px] mask mask-squircle ">
  <Image src={session.user?.image!}  alt="photo" layout="fill"/>
</div>
</div>
  }
  export default Nav