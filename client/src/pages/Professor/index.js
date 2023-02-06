import { useState, useEffect } from "react";
import axios from "axios";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { handleRender } from "./components/TooltipSlider";
import toLabel from "../../components/utils/toLabel";
import { AiOutlineClose } from "react-icons/ai";
import { BsStar, BsStarHalf, BsStarFill } from "react-icons/bs";
import "./Professor.css";

const Professor = () => {
  const [professor, setProfessor] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const professorCode = window.location.pathname.split("/")[2];
    const getProfessor = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/professors/get_professor_details/${professorCode}`
        );
        console.log(data);
        setProfessor(data);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };
    getProfessor();
  }, []);

  const [nicknameModal, setNicknameModal] = useState(false);
  const [newNickname, setNewNickname] = useState("");

  const [ratings, setRatings] = useState({
    marks_rating: 0,
    attendance_rating: 0,
    personality: 0,
    teaching: 0,
    knowledge: 0,
  });
  const calcAvgRating = (ratings) => {
    let scores = Object.values(ratings);
    if (scores.length === 0) return 0;
    let sum = scores.reduce((acc, curr) => acc + curr, 0);
    return sum / scores.length;
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
              <span className="ml-2 pt-2 pb-1">({professor.code})</span>
            </div>
            <div>{professor.designation + ", Information Technology"}</div>
            <div>College of Technology, Pantnagar</div>
          </div>
        </div>
        <div className="my-4">
          <h3 className="mb-2">Nicknames</h3>
          <div className="flex flex-wrap gap-2">
            {professor.nicknames?.map((nickname) => (
              <div className="simple-tab tab-theme-blue">{nickname}</div>
            ))}
            <div
              className="simple-tab tab-theme-default cursor-pointer"
              onClick={() => setNicknameModal(true)}
            >
              Click to add new
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between my-4">
          <h3>Ratings ({calcAvgRating(professor.ratings)}/5)</h3>
          <button
            className="btn-primary"
            onClick={() => {
              if (Object.values(ratings).every((rating) => rating > 0))
                console.log(ratings);
              else alert("Please rate all the metrics");
            }}
          >
            Submit
          </button>
        </div>
        <div className="card ratings">
          <div className="card-body">
            <div className="grid grid-cols-3">
              <div className="mb-2 font-medium">Rating Metric</div>
              <div className="mb-2 font-medium">Current Rating</div>
              <div className="mb-2 text-center font-medium">Your Rating</div>
              {Object.entries(professor.ratings).map(([key, value]) => (
                <>
                  <div className="flex items-center">{toLabel(key)}</div>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.floor(value))].map((_, index) => (
                      <BsStarFill className="text-blue" />
                    ))}
                    {value % 1 >= 0.5 && <BsStarHalf className="text-blue" />}
                    {value < 5 &&
                      [
                        ...Array(
                          Math.ceil(5 - (value % 1 >= 0.5 ? value + 1 : value))
                        ),
                      ].map((_, index) => <BsStar className="text-blue" />)}
                  </div>
                  <Slider
                    min={0}
                    max={5}
                    step={0.5}
                    defaultValue={ratings[key]}
                    handleRender={handleRender}
                    onChange={(value) =>
                      setRatings({ ...ratings, [key]: value })
                    }
                  />
                </>
              ))}
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