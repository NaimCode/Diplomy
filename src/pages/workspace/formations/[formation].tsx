import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";

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
 const utilisateur = await prisma.utilisateur
 .findUnique({
   where: {
     email: session?.user?.email||"",
   },
   include: {
     etablissement: {
       include: {
         formations: true,
       },
     },
   },
 })
 .then((data) => JSON.parse(JSON.stringify(data)));
  const formations=utilisateur.etablissement.formations

  // const formation

  return {
    props: {
     
     // etablissement: utilisateur.etablissement,

      ...(await serverSideTranslations(context.locale || "", ["common"])),
    },
  };
};
//TODO: added ability to choose template

const FormationItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
console.log(props);

return     <>
<Workspace>
<div>Heleo</div>
</Workspace>
</>
  
};

export default FormationItem;
