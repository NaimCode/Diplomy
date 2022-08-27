import React from 'react'
import Image from 'next/image'
import { APP_ICON } from '../constants/assets'
type LogoProps={
    isLinkToHome?:boolean
}
const Logo = ({}:LogoProps) => {
  return (
    <div>
          <Image src={APP_ICON} alt="logo" height={"50px"} width={"50px"}/>
    </div>
  )
}

export default Logo