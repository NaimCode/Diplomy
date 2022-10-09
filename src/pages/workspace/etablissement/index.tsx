import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";

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
        ...(await serverSideTranslations(context.locale||"", ["common"])),
      },
    };
  }
  
const Etablissement=(props: InferGetServerSidePropsType<typeof getServerSideProps>)=>{
    return <>
    <Workspace>
        <div></div>
    </Workspace>
    </>
}

export default Etablissement