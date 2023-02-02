import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col">
      <Header />
      <div className="page-template">
        <Outlet />
        {children}
      </div>
    </div>
  );
};

export default Layout;
