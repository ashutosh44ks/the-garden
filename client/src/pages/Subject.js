import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toLabel from "../components/utils/toLabel";
import { AiFillStar } from "react-icons/ai";

const Subject = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [subject, setSubject] = useState({});
  const subjectId = window.location.pathname.split("/")[2];

  useEffect(() => {
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
    getSubject();
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
  const numToLevel = (num) => {
    if (num === 1) return "Easy";
    if (num === 2) return "Medium";
    if (num === 3) return "Hard";
    return "Expert";
  };

  if (isLoading) return <div>Loading...</div>;
  if (Object.keys(subject) === 0)
    return <div className="p-8">Subject not found</div>;
  return (
    <div className="p-8">
      <div className="card">
        <div className="card-body">
          <div className="flex items-center mb-2 justify-between">
            <div className="flex items-end text-dark">
              <h1 className="text-2xl mr-2">{subject.name}</h1>
              <span>{subject.code}</span>
            </div>
            <button className="btn-primary">Update Details</button>
          </div>
          <p className="text-dark text-sm mb-4 w-3/4">{subject.description}</p>
          <div className="mb-4">
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
              {subject.practicals ? "Practical subject" : "Theoretical subject"}
            </span>
            <span
              className={`simple-tab ${
                subject.difficulty > 4 ? "tab-theme-red" : ""
              } ${subject.difficulty === 4 ? "tab-theme-orange" : ""}
          ${subject.difficulty === 3 ? "tab-theme-yellow" : ""}
          ${subject.difficulty < 3 ? "tab-theme-green" : ""}
          `}
            >
              {numToLevel(subject.difficulty)} difficulty
            </span>
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
