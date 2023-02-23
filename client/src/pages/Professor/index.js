import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { handleRender } from "./components/TooltipSlider";
import toLabel from "../../components/utils/toLabel";
import { AiOutlineClose } from "react-icons/ai";
import "./Professor.css";
import StarRating from "../../components/common/StarRating";

const Professor = () => {
  const [professor, setProfessor] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const { professorCode } = useParams();

  useEffect(() => {
    const getProfessor = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/professors/get_professor_details/${professorCode}`
        );
        setProfessor(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getProfessor();
  }, []);

  const [userRatings, setUserRatings] = useState({
    marks_rating: 0,
    attendance_rating: 0,
    personality: 0,
    teaching: 0,
    knowledge: 0,
  });
  useEffect(() => {
    if (professor.professor_code === undefined) return;
    let ourRating = JSON.parse(
      localStorage.getItem("logged")
    ).rated_professors.find(
      (prof) => prof.professor_code === professor.professor_code
    );
    if (ourRating === undefined) return;
    setUserRatings(
      JSON.parse(localStorage.getItem("logged")).rated_professors.find(
        (prof) => prof.professor_code === professor.professor_code
      )
    );
  }, [professor]);

  const [nicknameModal, setNicknameModal] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  const calcAvgRating = (ratings) => {
    let temp = { ...ratings };
    // remove a key 'count'
    delete temp.count;
    let scores = Object.values(temp);
    if (scores.length === 0) return 0;
    let sum = scores.reduce((acc, curr) => acc + curr, 0);
    return (sum / scores.length).toFixed(2);
  };

  const updateRatings = async () => {
    try {
      let username = JSON.parse(localStorage.getItem("logged")).username;
      const { data } = await axios.put(
        `http://localhost:3001/api/professors/update_professor_ratings/${professor.professor_code}`,
        {
          ratings: userRatings,
          username,
        }
      );
      setProfessor(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (Object.keys(professor).length === 0)
    return <div className="p-8">Professor not found</div>;
  return (
    <>
      <div className="p-8">
        <div className="card bg-code">
          <div className="card-body">
            <div className="flex items-end">
              <h2>{professor.name}</h2>
              <span className="ml-2 pt-2 pb-1">
                ({professor.professor_code})
              </span>
            </div>
            <div>{professor.designation + ", Information Technology"}</div>
            <div>College of Technology, Pantnagar</div>
          </div>
        </div>
        {/* <div className="my-4">
          <h3 className="mb-2">Nicknames</h3>
          <div className="flex flex-wrap gap-2">
            {professor.nicknames?.map((nickname) => (
              <div className="simple-tab tab-theme-blue" key={nickname}>
                {nickname}
              </div>
            ))}
            <div
              className="simple-tab tab-theme-default cursor-pointer"
              onClick={() => setNicknameModal(true)}
            >
              Click to add new
            </div>
          </div>
        </div> */}
        <div className="flex items-center justify-between my-4">
          <h3>Ratings ({calcAvgRating(professor.ratings)}/5)</h3>
          <button className="btn-primary" onClick={updateRatings}>
            Submit
          </button>
        </div>
        <div className="card ratings">
          <div className="card-body">
            <div className="grid grid-cols-3">
              <div className="mb-2 font-medium">Rating Metric</div>
              <div className="mb-2 font-medium">Current Rating</div>
              <div className="mb-2 text-center font-medium">Your Rating</div>
              {Object.entries(professor.ratings).map(([key, value]) =>
                key === "count" ? null : (
                  <>
                    <div>{toLabel(key)}</div>
                    <StarRating value={value} />
                    <Slider
                      min={0}
                      max={5}
                      step={0.5}
                      value={userRatings[key]}
                      handleRender={handleRender}
                      onChange={(value) =>
                        setUserRatings({ ...userRatings, [key]: value })
                      }
                    />
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {nicknameModal && (
        <>
          <div className="modal bg-grid">
            <div className="flex items-center justify-between">
              <h1 className="text-xl">Add new nickname</h1>
              <button className="p-2" onClick={() => setNicknameModal(false)}>
                <AiOutlineClose />
              </button>
            </div>
            <div className="mt-2">
              <input
                className="w-full"
                placeholder="Enter new nickname"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                className="btn-primary"
                onClick={() => {
                  setNicknameModal(false);
                  setNewNickname("");
                }}
                disabled={newNickname.length === 0}
              >
                Send for approval
              </button>
            </div>
          </div>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            onClick={() => {
              setNicknameModal(false);
              setNewNickname("");
            }}
          ></div>
        </>
      )}
    </>
  );
};

export default Professor;
