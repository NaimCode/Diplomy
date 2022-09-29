import {  InjectedConnector } from "@web3-react/injected-connector";
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

export   const injectedConnector = new InjectedConnector({supportedChainIds: [1,3, 4, 5, 42, ],})


export const useWeb3Connection=()=>{
    const {t}=useTranslation()
    const { chainId, account, activate, active,library,deactivate } = useWeb3React<Web3Provider>()
   // const [meta, setmeta] = useState<{account:string|undefined,active:boolean}>({active:false,account:undefined})
    const [isLoading, setisLoading] = useState(true)
    const connect=async () => {
     activate(injectedConnector).then((r)=>{}).catch((err)=>{
    console.log('erreur log to metaMask', err)
    toast.error(t('web3.erreur connexion'))
     
 }).finally(()=>{
    setisLoading(false)
 })
       
    }
    const disconnect= () => {
        deactivate()
      }
      useEffect(()=>{
       setTimeout(() => {
        connect()
       }, 5000);
      },[])
    useEffect(() => {
        if(active){
            console.log('account', account)
            console.log('library', library)
        }
    
      },[active]);

return {connect,disconnect,account,active,isLoading}  
}