import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { prisma } from "../../../server/db/client";
import { Formation } from ".prisma/client";

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
        email: session.user?.email!,
      },
      include: {
        etablissement: true
        // {
        //   include: {
        //     formations: true,
        //   },
        // },
      },
    })
    .then((data) => JSON.parse(JSON.stringify(data)));

  return {
    props: {
      etablissement: utilisateur?.etablissement!,

      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const FormationItem = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { formations } = props.etablissement;
  const { t } = useTranslation();

  return (
    <>
      <Workspace>
<div></div>
      </Workspace>
    </>
  );
};

export default FormationItem;
