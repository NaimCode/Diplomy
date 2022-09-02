import React from "react";
import { useTheme } from "next-themes";
import { APP_NAME } from "../constants/global";
type LogoProps = {
  isLinkToHome?: boolean;
  size?: "small" | "medium" | "large";
};

export const LogoBrand = () => {
  return (
    <div className="flex flex-row gap-1 items-center">
      <LogoSVG />
      <Brand />
    </div>
  );
};
//TODO: animate logo
export const Brand = () => {
  const { theme } = useTheme();
  return (
    <h3
      className={`text-2xl font-bold text-md font-logo `}
    >
      {APP_NAME}
    </h3>
  );
};

type LogoSVGProps = {
  isLinkToHome?: boolean;
  size?: "small" | "medium" | "large";
};
export const LogoSVG = ({size='medium'}:LogoSVGProps) => {
  const dimension =
  size == "small" ? "25" : size == "medium" ? "42" : "80";
  return (
    <svg
      width={dimension}
      className="drop-shadow-sm"
      height={dimension}
      viewBox={`0 0 80 80`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M39.99 7.77871L55.2626 15.4553L63.0064 11.5744L39.99 0L1.54474 19.3361L9.24944 23.217L39.99 7.77871Z"
        fill="#570DF8"
      />
      <path
        d="M70.7114 15.4553L39.9903 30.8936L24.7178 23.217L16.9936 27.0978L39.9903 38.6553L78.4552 19.3362L70.7114 15.4553Z"
        fill="#570DF8"
      />
      <path
        d="M7.72426 41.4299L0 37.549V60.6639L38.4453 80V72.2383L7.72426 56.783V41.4299Z"
        fill="#570DF8"
      />
      <path
        d="M0 29.787L30.721 45.2253V60.5784L38.4453 64.4763V41.3444L0 22.0253V29.787Z"
        fill="#570DF8"
      />
      <path
        d="M64.5516 37.5489V29.7872L41.5352 41.3446V79.9998L49.2595 76.119V45.2254L64.5516 37.5489Z"
        fill="#570DF8"
      />
      <path 
        d="M72.2562 25.9062V56.7827L56.9836 64.4763V72.238L80 60.6636V22.0253L72.2562 25.9062Z"
        fill="#570DF8"
      />
    </svg>
  );
};
export default LogoSVG;
