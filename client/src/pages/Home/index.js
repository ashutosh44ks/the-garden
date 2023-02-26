import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import truncateString from "../../components/utils/truncateString";
import { FiAlertCircle } from "react-icons/fi";
import { MdFilterList } from "react-icons/md";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const [year, setYear] = useState(1);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/subjects/get_all_subjects/${year}`
        );
        setSubjects(data.filteredSubjects);
      } catch (err) {
        console.log(err);
        setSubjects([]);
      }
    };
    getSubjects();
  }, [year]);

  return (
    <>
      <div className="bg-blue p-8 text-white flex justify-between items-center gap-8 banner">
        <div className="banner-text">
          <h1 className="mb-4">
            Hi, {JSON.parse(localStorage.getItem("logged")).username}
          </h1>
          <p>
            This a new online space for IT students of College of Technology,
            GBPUAT. The aim of this initiative is to simplify the already
            "simplified" life of IT students.
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
            Select year to filter <FiAlertCircle className="ml-2 text-sm" />
          </p>
          <div className="flex items-center text-blue cursor-pointer">
            <MdFilterList className="mr-2" />
            <span>Show more filters</span>
          </div>
        </div>
        <div className="mt-5 flex gap-2 year-tabs">
          <button
            className={`year-tab ${year === 1 ? "active" : ""}`}
            onClick={() => setYear(1)}
          >
            First Year
          </button>
          <button
            className={`year-tab ${year === 2 ? "active" : ""}`}
            onClick={() => setYear(2)}
          >
            Second Year
          </button>
          <button
            className={`year-tab ${year === 3 ? "active" : ""}`}
            onClick={() => setYear(3)}
          >
            Third Year
          </button>
          <button
            className={`year-tab ${year === 4 ? "active" : ""}`}
            onClick={() => setYear(4)}
          >
            Final Year
          </button>
        </div>
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
          <div
            className="flex flex-wrap justify-between gap-4 my-5"
          >
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
                  {subject.gate && <span className="small-tab">GATE</span>}
                  {subject.practical && (
                    <span className="small-tab">Practicals</span>
                  )}
                  <span className="small-tab">{subject.credits} credits</span>
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
