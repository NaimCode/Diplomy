import { GetServerSideProps } from "next"


export const getServerSideProps=()=>{
    return {
        redirect:{
            destination:"/workspace/etudiants/initiale",
            permanent:true
        }
    }
}

const Etudiants=()=>{
   return <div></div>
}
export default Etudiants