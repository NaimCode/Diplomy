import {
  ContractMembre,
  Etablissement,
  Formation,
  Version,
  Diplome,
} from "@prisma/client";
import { Contract } from "ethers";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authOptions } from "../../api/auth/[...nextauth]";

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
  const id = context.query.contractId as string;
  // const utilisateur = JSON.parse(
  //   JSON.stringify(
  //     await prisma?.utilisateur.findUnique({
  //       where: {
  //         email: session.user?.email || "",
  //       },
  //     })
  //   )
  // );
  console.log(id);

  console.log("equal", id == "93c7a937-d916-412a-bd20-f2950d24ca16");
  const test = await prisma?.contract.findUniqueOrThrow({
    where: {
      id,
    },
  });
  console.log("test", test);

  const contract = JSON.parse(
    JSON.stringify(
      await prisma?.contract.findUnique({
        where: {
          id,
        },
        include: {
          aboutissement: {
            include: {
              versions: {
                include: {
                  diplome: true,
                },
              },
              diplome: true,
            },
          },
          membres: {
            include: {
              etablissement: true,
            },
          },
        },
      })
    )
  );

  const conditions = JSON.parse(
    JSON.stringify(
      await prisma?.formation.findMany({
        where: {
          id: {
            in: contract.conditionsId,
          },
        },
      })
    )
  );
  const utilisateur = JSON.parse(
    JSON.stringify(
      await prisma?.utilisateur.findUnique({
        where: {
          email: session.user?.email || "",
        },
        include: {
          etablissement: true,
        },
      })
    )
  );
  console.log(contract);

  return {
    props: {
      id,
      contract,
      conditions,
      utilisateur,
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};


const Confirmation = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
    const {t}=useTranslation()
    const text=(s:string)=>t('workspace.relation.'+s)
      return <div className="h-screen w-screen flex flex-row items-center justify-center">
<div>
    <h6>{text('step 2')}</h6>
</div>
<div>
<h6>{text('step 3')}</h6>
</div>
  </div>;
};

export default Confirmation;
