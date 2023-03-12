import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/layout/Header";
import "./Entry.css";
import Input from "../../components/common/MUI-themed/Input";
import Checkbox from "../../components/common/MUI-themed/Checkbox";

const Entry = () => {
  let navigate = useNavigate();

  const [loginTab, setLoginTab] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loginUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_AUTH_API_URL}/api/auth/login`,
        {
          username,
          password,
        }
      );
      // console.log(data);
      localStorage.setItem("logged", JSON.stringify(data));
      navigate("/");
    } catch (e) {
      console.log(e);
      if (e.response.status === 400) setErrorMsg(e.response.data.msg);
    }
  };
  const registerUser = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_AUTH_API_URL}/api/auth/register`,
        {
          username,
          password,
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
    const form = document.querySelector("form");
    form.reset();
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
              loginUser();
            } else registerUser();
          }}
          autoComplete="off"
        >
          <div className="w-1/2">
            <h2 className="text-center mt-8 card-title">
              {loginTab ? "Log In" : "Sign Up"}
            </h2>
            <div className="card-body">
              <div className="mb-6">
                <Input
                  label="Username"
                  type="text"
                  val={username}
                  setVal={setUsername}
                  className="w-full"
                  required
                />
              </div>
              <div className={loginTab ? "mb-6" : "mb-4"}>
                <Input
                  label="Password"
                  type="password"
                  val={password}
                  setVal={setPassword}
                  className="w-full"
                  required
                />
              </div>
              {!loginTab && (
                <div className="flex items-center mb-4">
                  <Checkbox
                    _id="terms"
                    val={termsAgreed}
                    setVal={setTermsAgreed}
                    text={
                      <>
                        I agree to the{" "}
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => navigate("/terms")}
                        >
                          terms and conditions
                        </span>
                      </>
                    }
                  />
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
