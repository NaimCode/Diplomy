import { ReactNode } from "react"
import Nav from "../partials/Nav"
import SideBar from "../partials/SideBar"

type WorkSpaceProps={
    children:ReactNode
}
const Workspace = ({children}:WorkSpaceProps) => {
  return (
    <>
      <main className="relative flex flex-row bg-base-100">
       <SideBar/>
        <section className="relative flex-grow">
          <Nav />
       {children}
        </section>
      </main>
    </>
  )
}

export default Workspace