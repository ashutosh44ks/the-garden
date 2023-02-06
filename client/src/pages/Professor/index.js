import { useState, useEffect } from "react";
import axios from "axios";
import toLabel from "../../components/utils/toLabel";
import { AiFillStar } from "react-icons/ai";

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

  if (isLoading) return <div>Loading...</div>;
  if (Object.keys(professor).length === 0)
    return <div className="p-8">Professor not found</div>;
  return (
    <div className="p-8 bg-white">
      <h1>{professor.name}</h1>
      <div>{professor.designation + ", Information Technology"}</div>
      <div>{professor.code}</div>
      <div className="my-4">
        <h3 className="mb-2">Nicknames</h3>
        <div className="flex flex-wrap gap-2">
          {professor.nicknames?.map((nickname) => (
            <div className="simple-tab tab-theme-blue">{nickname}</div>
          ))}
          <div className="simple-tab tab-theme-default cursor-pointer">
            Click to add new
          </div>
        </div>
      </div>
      <div className="my-4">
        <h3 className="mb-2">Ratings</h3>
        <div>
          {Object.entries(professor.ratings).map(([key, value]) => (
            <div className="flex">
              <span className="w-[10rem]">{toLabel(key)}:</span>
              <span className="mr-1">{value}</span>
              <AiFillStar className="text-blue" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Professor;
