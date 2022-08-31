import { motion } from "framer-motion"
import MyLottie from "../../components/MyLottie"
import animationData from '../../../public/lotties/error.json'
import { useTranslation } from "next-i18next"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { NavBackIcon } from "../../constants/icons"
//TODO:Styling this page
const Auth:NextPage = (props) => {
    const {t}=useTranslation()
    const router=useRouter()
  return (

    <div className="h-screen w-screen flex flex-col items-center justify-center p-6 text-center">
     <motion.div initial={{
      y:200,
      scale:0.7
     }} animate={{y:0,scale:1}} transition={{
      duration:0.8
     }} className="max-w-[200px] md:max-w-[300px]">
     <MyLottie animationData={animationData}/>
     </motion.div>
  
    
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.6,duration:0.6}}>
      <div className="py-[20px] md:py-[50px] w-full md:max-w-xl md:text-lg ">
      {t("error.auth ")}
      </div>
      <button onClick={()=>{
        router.push('/')
      }} className="btn btn-outline gap-3">
        <NavBackIcon className="icon"/>
        {t('global.retour')}
      </button>
      </motion.div>
    </div>
  )
}

export default Auth