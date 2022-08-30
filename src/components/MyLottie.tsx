/* eslint-disable @typescript-eslint/no-explicit-any */

import { useLottie } from "lottie-react";


type MyLottieProps = {
    animationData:any,
    loop?:boolean}
const MyLottie = ({loop=true,animationData}:MyLottieProps) => {
    const options = {
      animationData,
      loop,
    };
  
    const { View } = useLottie(options);
  
    return <>{View}</>;
  };

  export default MyLottie