import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiUserCircle } from "react-icons/hi";
import { HiOutlineShare } from "react-icons/hi";
import "./layout.css";

const Header = ({ loggedIn, loginTab, setLoginTab }) => {
  let navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  return (
    <div className="header flex justify-between items-center px-6 bg-white">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="assets/logo.webp" alt="logo" className="logo" />
        <h2>The Garden</h2>
      </div>
      {!loggedIn ? (
        <div className="header_btn-grp">
          <button
            className={loginTab && "text-blue"}
            onClick={() => setLoginTab(true)}
          >
            Log In
          </button>
          <button
            className={!loginTab && "text-blue"}
            onClick={() => setLoginTab(false)}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="header_btn-grp">
          <button
            className="cursor-pointer share-icon-parent"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link Copied!");
            }}
          >
            <HiOutlineShare className="share-icon" />
          </button>
          <button
            className="cursor-pointer user-icon-parent"
            onClick={() => setOpenDropdown(!openDropdown)}
            onBlur={() => {
              setOpenDropdown(false);
            }}
            tabindex="0"
          >
            <HiUserCircle className="user-icon" />
            {openDropdown && (
              <ul className="dropdown">
                <li
                  className="dropdown-item"
                  onClick={() => {
                    navigate("/profile");
                  }}
                >
                  Edit Profile
                </li>
                <li
                  className="dropdown-item"
                  onClick={() => {
                    localStorage.removeItem("logged");
                    navigate("/entry");
                  }}
                >
                  Exit the garden
                </li>
              </ul>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

Header.defaultProps = {
  loggedIn: true,
};

export default Header;
