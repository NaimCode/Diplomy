import { useTheme } from "next-themes";
import { useRouter } from "next/router"
import { useState, useEffect } from 'react';
type useLocaleType=()=>{isAr:boolean}
export const useLocale:useLocaleType=()=>{
    const {locale}=useRouter()
    const isAr:boolean=locale==='ar'
    return {
        isAr
    }
}

export default function useWindowDimensions() {

  const hasWindow = typeof window !== 'undefined';

  function getWindowDimensions() {
    const width = hasWindow ? window.innerWidth : null;
    const height = hasWindow ? window.innerHeight : null;
    return {
      width,
      height,
    };
  }

  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    if (hasWindow) {
      const handleResize=()=> {
        setWindowDimensions(getWindowDimensions());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [hasWindow]);

  return windowDimensions;
}


export const useMyTheme=()=>{
  const { theme } = useTheme();
  const [isDark, setisDark] = useState(theme == "dark");
  useEffect(() => {
    setisDark(theme == "dark");
  }, [theme]);

  return {isDark}
}