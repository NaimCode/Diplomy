import {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "../api/auth/[...nextauth]";

export const getServerSideProps: GetServerSideProps = async (context) => {
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
    redirect:{
      destination:"/workspace/etablissement",
      permanent:true
    }
  }
 
};


const Workspace: NextPage = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {

  return (
 <>
    <div></div>
    </>
  );
};

export default Workspace;
