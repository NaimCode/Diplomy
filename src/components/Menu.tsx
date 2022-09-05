
import { ReactNode } from "react";

type MenuType={
trigger:(tab:number)=>ReactNode,
position?:'end'|'top'|'left'|'right',
wight?:number,
children:ReactNode
}
const Menu = ({trigger,position="end",wight=210,children}:MenuType) => {
    return (
      <div className={`dropdown dropdown-${position} font-semibold`}>
        {trigger(0)}
        <ul
          tabIndex={0}
          className={`dropdown-content menu p-2 shadow-lg bg-base-200 rounded-box w-[${wight}] gap-2`}
        >
          {children}
        </ul>
      </div>
    );
  };

  export default Menu