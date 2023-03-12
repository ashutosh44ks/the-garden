import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import truncateString from "../../components/utils/truncateString";
import toLabel from "../../components/utils/toLabel";
import { FiAlertCircle } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState({});
  const getUserDetails = async () => {
    const username = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    ).username;
    try {
      const { data } = await api.get(
        `/api/users/get_user?username=${username}`
      );
      setUser(data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  const [year, setYear] = useState(1);
  const [subjects, setSubjects] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const tags = ["gate", "practicals"];
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const getFilteredSubjects = async () => {
      try {
        const { data } = await api.post(
          `/api/subjects/get_filtered_subjects?year=${year}`,
          { activeFilters }
        );
        setSubjects(data.filteredSubjects);
      } catch (err) {
        console.log(err);
        setSubjects([]);
      }
    };
    getFilteredSubjects();
  }, [activeFilters, year]);

  return (
    <>
      <div className="bg-blue p-8 text-white flex justify-between items-center gap-8 banner">
        <div className="banner-text">
          <h1 className="mb-4">
            Hi,{" "}
            {user.name?.split(" ")[0] ||
              jwt_decode(JSON.parse(localStorage.getItem("logged")).accessToken)
                .username}
          </h1>
          <p className="mb-2">
            Welcome to "The Garden," your one-stop platform for all your
            academic needs. Access notes, previous year exam questions, and
            syllabus updates for your classes at College of Technology and take
            your studies to the next level.
          </p>
          <p>
            If you have any suggestions or feedback, please feel free to contact
            us. We are always open to new ideas.
          </p>
          <button
            className="btn-tertiary mt-4"
            onClick={() => navigate("/about")}
          >
            Learn More
          </button>
        </div>
        <img src="/assets/banner.jpg" alt="banner" className="banner-img" />
      </div>
      <div className="p-8">
        <div className="flex justify-between filters">
          <p className="font-noto text-dark flex items-center">
            Select year to filter{" "}
            <FiAlertCircle
              className="ml-2 text-sm"
              title="Add profile details to automatically select your current year"
            />
          </p>
          <div
            className="flex items-center text-blue cursor-pointer"
            onClick={() => setShowFilters(!showFilters)}
          >
            <MdFilterList className="mr-2" />
            <span>
              {showFilters ? "Hide extra filters" : "Show more filters"}
            </span>
          </div>
        </div>
        <div className="mt-5 flex gap-2 filter-tabs">
          <button
            className={`filter-tab ${year === 1 ? "active" : ""}`}
            onClick={() => setYear(1)}
          >
            First Year
          </button>
          <button
            className={`filter-tab ${year === 2 ? "active" : ""}`}
            onClick={() => setYear(2)}
          >
            Second Year
          </button>
          <button
            className={`filter-tab ${year === 3 ? "active" : ""}`}
            onClick={() => setYear(3)}
          >
            Third Year
          </button>
          <button
            className={`filter-tab ${year === 4 ? "active" : ""}`}
            onClick={() => setYear(4)}
          >
            Final Year
          </button>
        </div>
        {showFilters && (
          <div className="mt-5 flex gap-2 filter-tabs">
            {tags.map((tag) => (
              <button
                className={`filter-tab 
                ${activeFilters.includes(tag) ? "active" : ""}
                `}
                onClick={() => {
                  if (activeFilters.includes(tag))
                    setActiveFilters(activeFilters.filter((t) => t !== tag));
                  else setActiveFilters([...activeFilters, tag]);
                }}
              >
                {toLabel(tag)}
              </button>
            ))}
          </div>
        )}
        {subjects.length === 0 && (
          <div className="my-5">
            No Subjects found. Request admin to add missing subject(s) by
            clicking{" "}
            <u
              className="text-blue cursor-pointer"
              onClick={() => {
                navigate("/about");
              }}
            >
              here
            </u>
          </div>
        )}
        {!!subjects.length && (
          <div className="flex flex-wrap gap-4 my-5">
            {subjects.map((subject) => (
              <div
                className="subject card cursor-pointer"
                onClick={() => navigate(`/subject/${subject.subject_code}`)}
                key={subject.subject_code}
              >
                <div className="card-body">
                  <div className="mb-2">
                    <h3 className="card-title">{subject.name}</h3>
                    <div className="card-subtitle text-sm text-grey-500">
                      {subject.subject_code}
                    </div>
                  </div>
                  <p className="card-text">
                    {truncateString(subject.description, 120)}
                  </p>
                </div>
                <div className="card-footer flex gap-2">
                  <span className="small-tab">{subject.credits} credits</span>
                  {subject.tags.includes("gate") && (
                    <span className="small-tab">GATE</span>
                  )}
                  {subject.tags.includes("practicals") && (
                    <span className="small-tab">Practicals</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
