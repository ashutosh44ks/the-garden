import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header";
import "./Entry.css";

const Entry = () => {
  let navigate = useNavigate();

  const [loginTab, setLoginTab] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const verifyUser = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/users/login?username=${username}&password=${password}`
      );
      console.log(data);
      localStorage.setItem("logged", JSON.stringify(data.user));
      navigate("/");
    } catch (e) {
      console.log(e);
      if (e.response.status === 401) setErrorMsg(e.response.data.msg);
    }
  };
  const addUser = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3001/api/users/register",
        {
          user: {
            username,
            password,
          },
        }
      );
      console.log(data);
      setLoginTab(true);
    } catch (e) {
      console.log(e);
      if (e.response.status === 400) setErrorMsg(e.response.data.msg);
    }
  };
  useEffect(() => {
    setErrorMsg("");
  }, [loginTab]);

  return (
    <>
      <Header loggedIn={false} loginTab={loginTab} setLoginTab={setLoginTab} />
      <div className="flex justify-center items-center page-template entry">
        <form
          className="card flex justify-between items-center"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!termsAgreed && !loginTab)
              return setErrorMsg("Please agree to the terms and conditions");
            if (loginTab) {
              verifyUser();
            } else addUser();
          }}
        >
          <div className="w-1/2">
            <h2 className="text-center mt-8 card-title">
              {loginTab ? "Log In" : "Sign Up"}
            </h2>
            <div className="card-body">
              <div className="mb-4">
                <input
                  className="w-full"
                  placeholder="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  className="w-full"
                  placeholder="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {!loginTab && (
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="terms"
                    name="terms"
                    value="terms"
                    onChange={(e) => setTermsAgreed(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="terms">
                    I agree to the{" "}
                    <span
                      className="text-blue-500 cursor-pointer"
                      onClick={() => navigate("/terms")}
                    >
                      terms and conditions
                    </span>
                  </label>
                </div>
              )}
              {errorMsg && (
                <div className="text-red-500 text-end text-sm err-msg">
                  {errorMsg}
                </div>
              )}
              <div>
                <button className="w-full btn-primary">
                  {loginTab ? "Enter" : "Join"}
                </button>
              </div>
            </div>
          </div>
          <div
            style={{ backgroundImage: `url("./assets/login.png")` }}
            className="login-side w-1/2"
          ></div>
        </form>
      </div>
    </>
  );
};

Entry.defaultProps = {
  LoginTab: true,
};

export default Entry;
