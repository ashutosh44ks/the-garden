import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className="page-template">
        <Outlet />
        {children}
      </div>
      <Footer />
    </>
  );
};

export default Layout;
