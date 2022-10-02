import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import Workspace from "../../../components/Workspace";
import { useTranslation } from "next-i18next";
import { AddIcon, ArrayRightIcon, ArrowDownIcon, ArrowUpIcon } from "../../../constants/icons";
import VoirPlus from "../../../components/VoidPlus";
import { useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useMyTransition } from "../../../utils/hooks";
import router from "next/router";

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
    props: {
      ...(await serverSideTranslations(context.locale!, ["common"])),
    },
  };
};

const Relation = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { t } = useTranslation();
  const text = (s: string) => t("workspace.relation." + s);
  return (
    <>
      <Workspace>
        <div className="p-6">
        <div className="flex flex-row justify-between items-center">
        <h3>{text('mes contrats')}</h3>
        <button onClick={()=>{
          router.push("/contract")
        }} className="btn btn-primary gap-2">
          <AddIcon className="icon"/>
          {t('global.ajouter')}
        </button>
        </div>
        </div>
        <PartenaireSection/>
      </Workspace>
    </>
  );
};

const PartenaireSection=()=>{
  const [up, setup] = useState(false)
  const controls = useAnimationControls();
  useEffect(() => {
    if (up) {
      controls.start({
        opacity: 1,
     
        height: 700,
      });
    } else {
      controls.start({
        opacity: 0,
      
        height: 0,
      });
    }
  }, [up]);
  return <div className="absolute bottom-5 right-5 max-h-[70%] w-[300px] bg-base-300 rounded-lg flex flex-col">
    <div onClick={()=>setup(!up)} className="btn btn-primary flex flex-row justify-between items-center shadow-sm">
    <h6>Parténariat</h6>
  
    {up?  <ArrowDownIcon className="swap-on icon"/>:<ArrowUpIcon className="swap-off icon"/> }

  
    </div>
    <motion.div animate={controls}>
    <div className="">

    </div>
    </motion.div>

    <motion.div animate={controls} className="mx-auto">
  
    </motion.div>
  </div>
}
export default Relation;
