import { useState } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import { HiUserCircle } from "react-icons/hi";
import { HiOutlineShare } from "react-icons/hi";
import "./layout.css";

const Header = ({ loggedIn, loginTab, setLoginTab }) => {
  let navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);

  const userRole = loggedIn
    ? jwt_decode(JSON.parse(localStorage.getItem("logged")).accessToken)?.role
    : null;

  return (
    <div className="header flex justify-between items-center px-6 bg-white">
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img src="/assets/logo.webp" alt="logo" className="logo" />
        <h2>The Garden</h2>
      </div>
      {!loggedIn ? (
        <div className="header_btn-grp">
          <button
            className={loginTab ? "text-blue" : ""}
            onClick={() => setLoginTab(true)}
          >
            Log In
          </button>
          <button
            className={!loginTab ? "text-blue" : ""}
            onClick={() => setLoginTab(false)}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="header_btn-grp">
          <button
            className="text-dark share-icon-parent"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert("Link Copied!");
            }}
          >
            <HiOutlineShare className="share-icon" />
          </button>
          <button
            className="text-dark user-icon-parent"
            onClick={() => setOpenDropdown(!openDropdown)}
            onBlur={() => {
              setOpenDropdown(false);
            }}
            tabIndex="0"
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
                {userRole && userRole !== "user" && (
                  <li
                    className="dropdown-item"
                    onClick={() => {
                      navigate("/panel");
                    }}
                  >
                    Admin panel
                  </li>
                )}
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
  loggedIn: false,
  loginTab: true,
  setLoginTab: () => {},
};

export default Header;
