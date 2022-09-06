import { ReactNode } from "react";
import Nav from "../partials/Nav";
import SideBar from "../partials/SideBar";

type WorkSpaceProps = {
  children: ReactNode;
};
const Workspace = ({ children }: WorkSpaceProps) => {
  return (
    <>
      <div className="drawer drawer-mobile">
        <input
          placeholder="_"
          id="Menu"
          type="checkbox"
          className="drawer-toggle"
        />
        <main className="drawer-content relative bg-base-100">
          <Nav />
          {children}
        </main>

        <div className="drawer-side">
          <label htmlFor="Menu" className="drawer-overlay"></label>
          <SideBar />
        </div>
      </div>
    </>
  );
};

export default Workspace;
