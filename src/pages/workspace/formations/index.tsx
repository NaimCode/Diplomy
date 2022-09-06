import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { AddIcon } from "../../../constants/icons";

export const getServerSideProps: GetServerSideProps = async (context) =>{
    const session = await unstable_getServerSession(
        context.req,
        context.res,
        authOptions
      );
    
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }
    return {
      props: {
        ...(await serverSideTranslations(context.locale!, ["common"])),
      },
    };
  }
  
const Formations=(props: InferGetServerSidePropsType<typeof getServerSideProps>)=>{
  const {t}=useTranslation()
    return <>
    <Workspace>
      <div className="p-4 lg:p-6">
   
      <div className="flex flex-row justify-between">
        <div/>
        <button className="btn  btn-primary gap-2 btn-sm lg:btn-md">
   <AddIcon className="text-xl"/>
  {t("global.ajouter")}
</button>
        </div>
        </div>
    </Workspace>
    </>
}

export default Formations