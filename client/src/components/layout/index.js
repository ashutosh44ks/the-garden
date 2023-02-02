import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="page-template">
        <Outlet />
        {children}
      </div>
    </>
  );
};

export default Layout;
