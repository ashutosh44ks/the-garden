import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode";
import api from "../../components/utils/api";
import toLabel from "../../components/utils/toLabel";
import SubjectGrid from "./components/SubjectGrid";
import { FiAlertCircle } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [suggestedTags, setSuggestedTags] = useState([]);
  const getSubjectTags = async () => {
    try {
      const { data } = await api.get(`/api/subjects/get_tags`);
      setSuggestedTags(data.tags);
    } catch (e) {
      console.log(e);
    }
  };

  const [user, setUser] = useState({});
  const [year, setYear] = useState(1);
  const getUserDetails = async () => {
    const username = jwt_decode(
      JSON.parse(localStorage.getItem("logged")).accessToken
    ).username;
    try {
      const { data } = await api.get(
        `/api/users/get_user?username=${username}`
      );
      setUser(data);
      if (data.year) setYear(data.year);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getSubjectTags();
    getUserDetails();
  }, []);

  const [subjects, setSubjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);
  useEffect(() => {
    const getFilteredSubjects = async () => {
      setLoading(true)
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
      setLoading(false);
    };
    if (user.name) getFilteredSubjects();
  }, [activeFilters, year, user]);

  return (
    <>
      <div className="bg-blue p-8 text-white flex justify-between items-center gap-8 banner">
        <div className="banner-text">
          <h1 className="mb-4">
            Hi,{" "}
            {user?.name?.split(" ")[0] ||
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
            {suggestedTags.map((tag) => (
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
        <SubjectGrid
          subjects={subjects}
          userRole={user.role}
          loading={loading}
        />
      </div>
      <div className="bg-blue p-8 text-white flex flex-col items-center justify-center">
        <h1>Check what's next and upcoming</h1>
        <button
          className="btn-secondary mt-4"
          onClick={() => navigate("/upcoming")}
        >
          Events and Notices
        </button>
      </div>
      <div className="px-8 py-12 flex xs:flex-wrap xs:gap-12 sm:flex-nowrap sm:gap-8">
        <div
          className="card cursor-pointer w-full"
          onClick={() => navigate("/calendars/semester")}
        >
          <div className="card-grid-design">
            <img src={"./assets/tasks.png"} alt="calendar" />
          </div>
          <div className="card-body">
            <h3 className="card-title mb-2">Semester Calendar</h3>
            <p className="card-text">
              Check dates for registrations, prefinals, makeup, lab finals,
              finals, and much more!
            </p>
          </div>
          <div className="card-footer flex gap-2">
            <button className="btn btn-secondary">View Calendar</button>
          </div>
        </div>
        <div
          className="card cursor-pointer w-full"
          onClick={() => navigate("/calendars/holiday")}
        >
          <div className="card-grid-design">
            <img src={"./assets/tasks-2.png"} alt="calendar" />
          </div>
          <div className="card-body">
            <h3 className="card-title mb-2">Holiday Calendar</h3>
            <p className="card-text">
              Check dates for yearly holidays. This calendar is updated yearly.
            </p>
          </div>
          <div className="card-footer flex gap-2">
            <button className="btn btn-secondary">Mark Holidays</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
