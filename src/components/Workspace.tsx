import Link from "next/link";
import { useRouter } from "next/router";
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
          <BreadCrumbs />
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

const BreadCrumbs = () => {
  const router = useRouter();
  const routes = router.asPath.split("/").filter((f, i) => i >= 2);

  return (
    <div
      className={`${
        routes && routes.length <= 1 && "hidden"
      } text-sm lg:text-md breadcrumbs px-3 lg:px-6`}
    >
      <ul>
        {routes.map((r, i) => {
          const isLast = i == routes.length - 1;
          
          return (
            <li key={i}>
              {isLast ? (
                r
              ) : (
                <Link href={"/workspace/"+routes.filter((rn,index)=>index<=i).join("/")}>
                  <a>{r}</a>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default Workspace;
