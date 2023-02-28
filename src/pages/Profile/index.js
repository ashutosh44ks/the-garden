import { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [university_id, setUniversity_id] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");
  useEffect(() => {
    const username = JSON.parse(localStorage.getItem("logged")).username;
    const fetchUser = async () => {
      const { data } = await axios.get(
        `http://localhost:3001/api/users/get_user?username=${username}`
      );
      setName(data[0].name);
      setUniversity_id(data[0].university_id);
      setBranch(data[0].branch);
      setYear(data[0].year);
    };
    fetchUser();
  }, []);

  const BranchList = [
    { value: "IT", label: "Information Technology" },
    { value: "CSE", label: "Computer Engineering" },
  ];

  const [errorMsg, setErrorMsg] = useState("");
  const updateUserInfo = async () => {
    try {
      const username = JSON.parse(localStorage.getItem("logged")).username;
      const { data } = await axios.patch(
        `http://localhost:3001/api/users/update_user?username=${username}`,
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
      localStorage.setItem("logged", JSON.stringify(data));
    } catch (e) {
      console.log(e);
      setErrorMsg(e.response.data.msg);
    }
  };

  return (
    <div className="profile-page p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="mb-2 text-dark font-medium">
          We're happy to have you here.
        </h1>
        <p className="text-dark-2">
          Tell us about yourself and we can start curating content specific to
          your details and need. You can always change these details later.
        </p>
        <div className="profile-form py-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateUserInfo();
            }}
          >
            <div className="input-group">
              <input
                className="bg-white"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
              <input
                className="bg-white"
                placeholder="University ID"
                val={university_id}
                onChange={(e) => setUniversity_id(e.target.value)}
                type="number"
                required
              />
              <select
                className="bg-white"
                placeholder="Branch"
                value={branch}
                onChange={(e) => {
                  setBranch(e.target.value);
                }}
                required
              >
                <option value="" disabled>
                  Select Branch
                </option>
                {BranchList.map((branch, index) => {
                  return (
                    <option key={index} value={branch.value}>
                      {branch.label}
                    </option>
                  );
                })}
              </select>
              <input
                className="bg-white"
                placeholder="Year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                type="number"
                required
              />
            </div>
            {errorMsg && (
              <div className="text-red-500 text-end text-sm err-msg">
                {errorMsg}
              </div>
            )}
            <div className="mt-4">
              <button className="btn btn-primary" type="submit">
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
