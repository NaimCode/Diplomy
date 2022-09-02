import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";
type ProfileCardProps={
    session:Session
    
}
const ProfileCard = ({session}:ProfileCardProps) => {
 
  const {user} = session;
//TODO: placeholder for image
  return (
    <div className="flex flex-row justify-between p-6">
      <div className="avatar">
        <div className={`w-[70px] mask mask-squircle placeholder:${user?.name![0]}`}>
          <Image src={user?.image!} layout="fill"/>
        </div>
      </div>
      <div className="divider divider-horizontal"/>
          <div className="w-[260px] flex flex-col h-auto justify-center">
          <h5 className="">{user?.name}</h5>
          <p className="truncate block text-[12px]">{user?.email}</p>
          
          </div>
    </div>
  );
};

export default ProfileCard;
