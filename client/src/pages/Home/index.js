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
  const [loading, setLoading] = useState(true);

  const [suggestedTags, setSuggestedTags] = useState([]);
  const getCurrentSubjectTags = async () => {
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
    setLoading(false);
  };
  useEffect(() => {
    getCurrentSubjectTags();
    getUserDetails();
  }, []);

  const [subjects, setSubjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
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
    if (!loading) getFilteredSubjects();
  }, [activeFilters, year, loading]);

  if (loading) return <div className="p-8">loading...</div>;
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
        <div className="flex flex-wrap items-stretch gap-4 my-5">
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
                {subject.tags.slice(0, 4).map((tag) => (
                  <span className="small-tab" key={tag}>
                    {toLabel(tag)}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {user.role === "admin" || user.role === "moderator" ? (
            <div
              className="subject card cursor-pointer"
              onClick={() => navigate("/subject/new_subject")}
            >
              <div className="card-body">
                <div className="mb-2">
                  <h3 className="card-title">Add New Subject</h3>
                  <div className="card-subtitle text-sm text-grey-500">
                    This method is only available to admins and moderators.
                  </div>
                </div>
                <p className="card-text">
                  Admins can directly add new subjects to the database but
                  moderators will need approval from admins for the same.
                </p>
              </div>
            </div>
          ) : (
            subjects.length === 0 && (
              <div className="my-5">
                No Subjects found. Request admin to add missing subject(s) by
                clicking{" "}
                <u
                  className="text-blue cursor-pointer"
                  onClick={() => {
                    navigate("/contact");
                  }}
                >
                  here
                </u>
              </div>
            )
          )}
        </div>
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
