import Logo from "../components/Logo";
import { FileIcon } from "../constants/icons";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 sticky top-0 left-0">
      <div className="container max-w-7xl mx-auto h-full flex flex-row items-start justify-between gap-3">
        <Logo />
        <div className="flex-grow"></div>
        <button className="btn btn-outline gap-2">
          <FileIcon/>
          Demande d&apos;inscription</button>
        <button className="btn btn-primary">workspace</button>
      </div>
    </div>
  );
};

export default NavBar;
