import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import Input from "../../components/common/MUI-themed/Input";
import Select from "../../components/common/MUI-themed/Select";
import "./Profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [university_id, setUniversity_id] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  const username = jwt_decode(
    JSON.parse(localStorage.getItem("logged")).accessToken
  ).username;
  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await api.get(
          `/api/users/get_user?username=${username}`
        );
        setName(data.name || "");
        setUniversity_id(data.university_id || "");
        setBranch(data.branch || "");
        setYear(data.year || "");
      } catch (e) {
        console.log(e);
      }
    };
    getUserDetails();
  }, []);

  const BranchList = [
    { value: "IT", label: "Information Technology" },
    { value: "CSE", label: "Computer Engineering" },
  ];

  const [errorMsg, setErrorMsg] = useState("");
  const [disab, setDisab] = useState(false);

  const updateUserInfo = async () => {
    try {
      const { data } = await api.patch(
        `/api/users/update_user?username=${username}`,
        {
          user: {
            name,
            university_id,
            branch,
            year,
          },
        }
      );
      console.log(data);
      setErrorMsg("");
      setDisab(true);
    } catch (e) {
      console.log(e);
      setErrorMsg(e.response.data.msg);
    }
  };

  return (
    <div className="full-page profile-page p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="mb-2 text-dark font-medium">
          We're happy to have you here.
        </h1>
        <p className="text-dark-2">
          Tell us about yourself and we can start curating content specific to
          your details and need. You can always change these details later.
        </p>
        <div className="py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUserInfo();
            }}
          >
            <div className="profile-input-group">
              <Input
                label="Name"
                type="text"
                val={name}
                setVal={setName}
                required
              />
              <Input
                label="University ID"
                type="number"
                val={university_id}
                setVal={setUniversity_id}
                required
              />
              <Select
                label="Branch"
                options={
                  <>
                    <option value="" disabled>
                      Select Branch
                    </option>
                    {BranchList.map((branch) => {
                      return (
                        <option key={branch.value} value={branch.value}>
                          {branch.label}
                        </option>
                      );
                    })}
                  </>
                }
                val={branch}
                setVal={setBranch}
                required
              />
              <Input
                label="Year"
                type="number"
                val={year}
                setVal={setYear}
                required
              />
            </div>
            {errorMsg && (
              <div className="text-red-500 text-end text-sm err-msg">
                {errorMsg}
              </div>
            )}
            {}
            <div className="mt-4">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={disab}
              >
                Update Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
