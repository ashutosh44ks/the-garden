import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import toLabel from "../../components/utils/toLabel";
import "./Subject.css";
import { removeDirFromStorage } from "../../components/utils/fileHandling";

const Subject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState({});
  const [myRatedDifficulty, setMyRatedDifficulty] = useState(0);
  const [currentDifficulty, setCurrentDifficulty] = useState(0);
  const { subjectId } = useParams();

  const getSubject = async () => {
    try {
      const { data } = await api.get(
        `/api/subjects/get_subject?subject_code=${subjectId}`
      );
      setSubject(data.subject);
      setMyRatedDifficulty(data.userVote);
      setCurrentDifficulty(data.avgVotes);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getSubject();
  }, [subjectId]);

  const addSuffix = (num) => {
    if (num === 1) return num + "st";
    if (num === 2) return num + "nd";
    if (num === 3) return num + "rd";
    return num + "th";
  };

  const [openDropdown, setOpenDropdown] = useState(false);
  const vote_difficulty = async (userDifficulty) => {
    try {
      const { data } = await api.patch("/api/subjects/rate_difficulty", {
        subjectCode: subjectId,
        userDifficulty,
      });
      console.log(data);
      getSubject();
    } catch (err) {
      console.log(err);
    }
    setOpenDropdown(false);
  };

  const userRole = jwt_decode(
    JSON.parse(localStorage.getItem("logged")).accessToken
  )?.role;
  const removeSubject = async () => {
    const confirm = window.confirm(
      "Are you sure you want to remove this subject? All data from backend + files from firebase storage will be deleted."
    );
    if (!confirm) return;
    const alert = window.confirm(
      "Check network calls and firebase storage to confirm. In case of error, manually delete residuals to avoid clutter."
    );
    if (!alert) return;
    try {
      const { data } = await api.delete(
        `/api/subjects/delete_subject?subject_code=${subjectId}`
      );
      console.log(data);
      await removeDirFromStorage(`${subjectId}`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading)
    return (
      <div className="p-8">
        <div className="card subject-main">
          <div className="skeleton-loading card subject-main"></div>
        </div>
        <div className="my-4">
          <h3 className="mb-2">Professor History</h3>
          <div className="flex flex-wrap gap-4">
            <div className="skeleton-loading card professor-card"></div>
            <div className="skeleton-loading card professor-card"></div>
          </div>
        </div>
        <div>
          <h3 className="mb-2">Resources</h3>
          <div className="flex flex-wrap gap-4">
            <Link
              className="btn-secondary"
              to={`/subject/${subjectId}/syllabus/view`}
            >
              Syllabus
            </Link>
            <Link
              className="btn-secondary"
              to={`/subject/${subjectId}/notes/view`}
            >
              Notes
            </Link>
            <Link
              className="btn-secondary"
              to={`/subject/${subjectId}/qp/view`}
            >
              Previous Year Papers
            </Link>
          </div>
        </div>
        {userRole && userRole !== "user" && (
          <div className="mt-4">
            <h3 className="mb-2">Admin/Mod Options</h3>
            <div className="flex flex-wrap gap-4">
              <Link className="btn-secondary" to={`/subject/${subjectId}/edit`}>
                Edit details
              </Link>
              <button className="btn-danger" onClick={removeSubject}>
                Remove subject
              </button>
            </div>
          </div>
        )}
      </div>
    );
  if (!isLoading && Object.entries(subject).length === 0)
    return <div className="p-8">Subject not found</div>;
  return (
    <div className="p-8">
      <div className="card subject-main">
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
              {subject.tags.map((tag) => (
                <span className="simple-tab tab-theme-default" key={tag}>
                  {toLabel(tag)}
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2 flex-wrap">
              <span
                className={`simple-tab 
                  ${currentDifficulty <= 3 ? "tab-theme-red" : ""}
                  ${currentDifficulty <= 2.5 ? "tab-theme-yellow" : ""}
                  ${currentDifficulty <= 1.5 ? "tab-theme-green" : ""}
                `}
              >
                Current Difficulty: {currentDifficulty?.toFixed(2)}/3
              </span>
              <span
                className={`
                  simple-tab ${
                    myRatedDifficulty === 0 ? "tab-theme-red" : "tab-theme-blue"
                  }
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
      <div className="my-4">
        <h3 className="mb-2">Professor History</h3>
        <div className="flex flex-wrap gap-4">
          {subject.professors?.length > 0 &&
            subject.professors?.map((professor) => {
              return (
                <div className="card professor-card" key={professor.name}>
                  <div className="card-body">
                    <h3 className="card-title">{professor.name}</h3>
                    <div className="text-dark text-sm">{professor.year}</div>
                  </div>
                </div>
              );
            })}
        </div>
        {subject.professors?.length === 0 && (
          <div className="text-dark">
            No professors found. Request admin to add professor(s) by clicking{" "}
            <u
              className="text-blue cursor-pointer"
              onClick={() => {
                navigate("/contact");
              }}
            >
              here
            </u>
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-2">Resources</h3>
        <div className="flex flex-wrap gap-4">
          <Link
            className="btn-secondary"
            to={`/subject/${subjectId}/syllabus/view`}
          >
            Syllabus
          </Link>
          <Link
            className="btn-secondary"
            to={`/subject/${subjectId}/notes/view`}
          >
            Notes
          </Link>
          <Link className="btn-secondary" to={`/subject/${subjectId}/qp/view`}>
            Previous Year Papers
          </Link>
        </div>
      </div>
      {userRole && userRole !== "user" && (
        <div className="mt-4">
          <h3 className="mb-2">Admin/Mod Options</h3>
          <div className="flex flex-wrap gap-4">
            <Link className="btn-secondary" to={`/subject/${subjectId}/edit`}>
              Edit details
            </Link>
            <button className="btn-danger" onClick={removeSubject}>
              Remove subject
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Subject;
