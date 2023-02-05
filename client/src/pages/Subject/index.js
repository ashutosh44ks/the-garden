import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toLabel from "../../components/utils/toLabel";
import { AiFillStar } from "react-icons/ai";
import "./Subject.css";

const Subject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState({});
  const [myRatedDifficulty, setMyRatedDifficulty] = useState(0);
  const subjectId = window.location.pathname.split("/")[2];

  const getSubject = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3001/api/subjects/get_subject/${subjectId}`
      );
      setSubject(data.subject);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getSubject();
    let mySubject = JSON.parse(
      localStorage.getItem("logged")
    ).rated_difficulties.find((x) => x.subject_code === subjectId);
    if (mySubject) setMyRatedDifficulty(mySubject.difficulty);
  }, [subjectId]);

  const addSuffix = (num) => {
    if (num === 1) return num + "st";
    if (num === 2) return num + "nd";
    if (num === 3) return num + "rd";
    return num + "th";
  };
  const calcAvgRating = (ratings) => {
    let scores = Object.values(ratings);
    if (scores.length === 0) return 0;
    let sum = scores.reduce((acc, curr) => acc + curr, 0);
    return sum / scores.length;
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const vote_difficulty = async (userDifficulty) => {
    try {
      let username = JSON.parse(localStorage.getItem("logged")).username;
      const { data } = await axios.post(
        "http://localhost:3001/api/subjects/rate_difficulty",
        { username, subjectCode: subjectId, userDifficulty }
      );
      console.log(data);
      setMyRatedDifficulty(userDifficulty)
      getSubject();
    } catch (err) {
      console.log(err);
    }
    setOpenDropdown(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (Object.keys(subject) === 0)
    return <div className="p-8">Subject not found</div>;
  return (
    <div className="p-8">
      <div className="card">
        <div className="card-body flex justify-between items-start">
          <div className="w-3/4">
            <div className="flex items-end text-dark">
              <h1 className="text-2xl mr-2">{subject.name}</h1>
              <span>{subject.subject_code}</span>
            </div>
            <p className="text-dark text-sm mb-4">{subject.description}</p>
            <div className="flex gap-2 flex-wrap">
              <span className="simple-tab tab-theme-blue">
                {addSuffix(subject.year)} year
              </span>
              <span
                className={`simple-tab ${
                  subject.credits > 4 ? "tab-theme-red" : ""
                } ${subject.credits === 4 ? "tab-theme-orange" : ""}
          ${subject.credits === 3 ? "tab-theme-yellow" : ""}
          ${subject.credits < 3 ? "tab-theme-green" : ""}
          `}
              >
                {subject.credits} credits
              </span>
              <span
                className={`mr-2 text-sm simple-tab ${
                  subject.gate ? "tab-theme-red" : "tab-theme-green"
                }`}
              >
                {subject.gate ? "Gate Subject" : "Non-Gate Subject"}
              </span>
              <span
                className={`mr-2 text-sm simple-tab ${
                  subject.practicals ? "tab-theme-yellow" : "tab-theme-green"
                }`}
              >
                {subject.practicals
                  ? "Practical subject"
                  : "Theoretical subject"}
              </span>
            </div>
            <div className="flex gap-2 mt-2">
              <span
                className={`simple-tab 
              ${subject.difficulty <= 3 ? "tab-theme-red" : ""}
              ${subject.difficulty <= 2.5 ? "tab-theme-yellow" : ""}
              ${subject.difficulty <= 1.5 ? "tab-theme-green" : ""}
        `}
              >
                Current Difficulty: {subject.difficulty.toFixed(2)}/3
              </span>
              <span
                className={`
              simple-tab ${myRatedDifficulty === 0 ? "tab-theme-red" : "tab-theme-blue"}
              `}
              >
                Your vote: {myRatedDifficulty}
              </span>
            </div>
          </div>
          <div className="difficulty-dropdown">
            <button
              className="btn-primary dropdown-parent"
              onClick={() => {
                setOpenDropdown(!openDropdown);
              }}
            >
              Vote Difficulty
            </button>
            {openDropdown && (
              <ul className="dropdown">
                <li
                  className="dropdown-item"
                  onClick={() => {
                    vote_difficulty(1);
                  }}
                >
                  Easy
                </li>
                <li
                  className="dropdown-item"
                  onClick={() => {
                    vote_difficulty(2);
                  }}
                >
                  Medium
                </li>
                <li
                  className="dropdown-item"
                  onClick={() => {
                    vote_difficulty(3);
                  }}
                >
                  Hard
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="py-4">
        <div className="mb-4">
          <h3>Professor History</h3>
          <div className="text-dark text-sm mb-2">
            Ratings ranges from 1 (bad) to 5 (good)
          </div>
          <div
            className="
        grid
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-4
        "
          >
            {subject.professors.map((professor) => {
              return (
                <div className="card" key={professor.code}>
                  <div className="card-body">
                    <h3 className="card-title">
                      {`${professor.name} (${professor.code})`}
                    </h3>
                    <div className="text-dark text-sm mb-2">
                      {professor.designation +
                        ", " +
                        (professor.active
                          ? "Current lecturer"
                          : "Former lecturer")}
                    </div>
                    {Object.entries(professor.ratings).map(([key, value]) => {
                      return (
                        <div className="flex items-center" key={key}>
                          <span className="w-[10rem]">{toLabel(key)}:</span>
                          <span className="mr-1">{value}</span>
                          <AiFillStar className="text-blue" />
                        </div>
                      );
                    })}
                    <div className="flex items-center">
                      <span className="w-[10rem]">Average Rating:</span>
                      <span className="mr-1">
                        {calcAvgRating(professor.ratings)}
                      </span>
                      <AiFillStar className="text-blue" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div>
          <h3 className="mb-4">Resources</h3>
          <div className="flex gap-4">
            <button
              className="btn-secondary"
              onClick={() => {
                navigate(`/subject/${subjectId}/syllabus`);
              }}
            >
              Syllabus
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                navigate(`/subject/${subjectId}/notes`);
              }}
            >
              Notes
            </button>
            <button
              className="btn-secondary"
              onClick={() => {
                navigate(`/subject/${subjectId}/question_papers`);
              }}
            >
              Previous Year Papers
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subject;