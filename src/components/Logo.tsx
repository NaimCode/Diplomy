import React from 'react'
import Image from 'next/image'
import { APP_ICON } from '../constants/assets'
import {useTheme} from "next-themes"
import { APP_NAME } from '../constants/global'
type LogoProps={
    isLinkToHome?:boolean,
    size?:"small"|"medium"|"large"
}
const Logo = ({size="medium"}:LogoProps) => {
  const dimension=size=="small"?"30px":size=="medium"?"36px":"80px"
  return (
 
          <Image src={APP_ICON} alt="logo" height={dimension} width={dimension}/>
    
  )
}

export const LogoBrand=()=>{
  return <div className='flex flex-row gap-1 items-center'>
    <Logo size='medium'/>
    <Brand/>
  </div>
}
export const Brand=()=>{
  const {theme}=useTheme()
  return <h3 
  // style={{
  //   color:theme=='dark'?"white":"black"
  // }} 
  className='text-2xl font-bold text-md font-logo'>{APP_NAME}</h3>
}
export default Logo