/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLottie } from "lottie-react";
import { NextPage, InferGetServerSidePropsType } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import dataAnimation from "../../../public/lotties/success.json";
import { NavBackIcon } from "../../constants/icons";


export async function getServerSideProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
const Success = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {t} = useTranslation()
  const router=useRouter()
  const {query}=router
  let text=''

 if(query){

  switch (query.type) {
    case 'inscription':
      text="state.Success inscription"
      break;
  
    default:
      break;
  }
 }
  
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 text-center">
      <Animation />
    
      <div className="py-[20px] md:py-[50px] w-full md:max-w-xl">
      {t(text)}
      </div>
      <button onClick={()=>{
        router.back()
      }} className="btn btn-outline gap-3">
        <NavBackIcon className="icon"/>
        {t('global.retour')}
      </button>
    </div>
  );
};

const Animation = () => {
  const options = {
    animationData: dataAnimation,
    loop:true,
  };

  const { View } = useLottie(options);

  return <div className="max-w-[200px] md:max-w-[300px]">{View}</div>;
};
export default Success;
