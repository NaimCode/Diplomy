/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useAnimationControls } from "framer-motion";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import { NFTStorage } from "nft.storage";
import { useState, useEffect, useRef } from "react";
import { env } from "../env/client.mjs";
type useLocaleType = () => { isAr: boolean };
export const useLocale: useLocaleType = () => {
  const { locale } = useRouter();
  const isAr: boolean = locale === "ar";
  return {
    isAr,
  };
};

export default function useWindowDimensions() {
  const hasWindow = typeof window !== "undefined";

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    if (hasWindow) {
      const handleResize = () => {
        setWindowDimensions(getWindowDimensions());
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}

export const useMyTheme = () => {
  const { theme } = useTheme();
  const [isDark, setisDark] = useState(theme == "dark");
  useEffect(() => {
    setisDark(theme == "dark");
  }, [theme]);

  return { isDark };
};

type useMyTransition = {
  trigger: boolean,
  direction?:"right"|"left"|"top"|"bottom"
};
export const useMyTransition = ({ trigger,direction='left' }: useMyTransition) => {
  const controls = useAnimationControls();
  let x=0
  switch (direction) {
    case 'left':
      x=-100
      break;
      case 'right':
        x=100
        break;
    
    default:
      break;
  }
  useEffect(() => {
    if (trigger) {
      controls.start({
        opacity: 1,
        x: 0,
        height: "auto",
      });
    } else {
      controls.start({
        opacity: 0,
        x,
        height: 0,
      });
    }
  }, [trigger]);

  return {controls}
};


export const useDimensionFromEl=()=>{
  const ref=useRef<HTMLDivElement>(null)
  const [show, setshow] = useState(false)
  const [dimension, setdimension] = useState({width:0,height:0})

  useEffect(() => {
    if(ref.current){
      const el=ref.current
      const width=el.clientWidth
      const height=el.clientHeight
      setdimension({
        width,
        height
      })
      setshow(true)
    }
  }, [ref.current])
  
  return {ref,dimension,show}
}

export const useImageOpti=(url:string,quality:number)=>{
  if(url.includes('res.cloudinary.com')){
    const urlTemp=url.split('upload/')
    return urlTemp[0]+`upload/q_${quality}/${urlTemp[1]}`
  }
  return url
}


type useUploadToIPFSProps={
  file?:File | undefined,
   name?:string, description?:string
}

export const GATEWAY_IPFS="https://cloudflare-ipfs.com/ipfs/"
export const useUploadToIPFS=()=>{


  const init=async()=>{
   const { create } = await import('ipfs-http-client')
  const projectId = '2FP5zvmKLVbpu94CI3SpaZzdGx1';
  const projectSecret = 'aacefddd77985325fa409fa103d22623';
  
  const auth =
      'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');
  
   const infura = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
          authorization: auth,
      },
  });
  return infura
}
return {init}
}