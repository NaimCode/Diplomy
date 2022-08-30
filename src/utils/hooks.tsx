import { useRouter } from "next/router"
type useLocaleType=()=>{isAr:boolean}
export const useLocale:useLocaleType=()=>{
    const {locale}=useRouter()
    const isAr:boolean=locale==='ar'
    return {
        isAr
    }
}