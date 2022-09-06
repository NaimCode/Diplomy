import { useSession } from "next-auth/react";
import { useTranslation } from "next-i18next";
import Image from 'next/image'
const AvatarButton = () => {
    const { data: session } = useSession();
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

  export default AvatarButton