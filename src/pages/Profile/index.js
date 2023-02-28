import { useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [name, setName] = useState("");
  const [university_id, setUniversity_id] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState("");

  const BranchList = [
    { value: "IT", label: "Information Technology" },
    { value: "CSE", label: "Computer Engineering" },
  ];

  const [errorMsg, setErrorMsg] = useState("");
  const updateUserInfo = async () => {
    try {
      console.log(name, university_id, branch, year);
      const { data } = await axios.patch(
        "http://localhost:3001/api/users/update",
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
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="profile-page">
      <h1 className="mb-2 text-dark">We're happy to have you here.</h1>
      <p className="text-dark-2">
        Tell us about yourself and we can start helping you learn with subjects'
        details, syllabus, notes, and previous year exam questions.
      </p>
      <div className="profile-form mt-8 w-1/2">
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            updateUserInfo();
          }}
        >
          <input
            className="bg-white"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            required={false}
          />
          <input
            className="bg-white"
            placeholder="University ID"
            val={university_id}
            onChange={(e) => setUniversity_id(e.target.value)}
            type="number"
            required={false}
          />
          <select
            className="bg-white"
            placeholder="Branch"
            value={branch}
            onChange={(e) => {
              setBranch(e.target.value);
            }}
            required={false}
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
            required={false}
          />
          {errorMsg && (
            <div className="text-red-500 text-end text-sm err-msg">
              {errorMsg}
            </div>
          )}
          <div>
            <button className="btn btn-primary" type="submit">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
