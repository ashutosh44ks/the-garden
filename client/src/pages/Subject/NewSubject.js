import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../components/utils/api";
import Input from "../../components/common/MUI-themed/Input";
import Select from "../../components/common/MUI-themed/Select";
import TextArea from "../../components/common/MUI-themed/TextArea";
import { FiAlertCircle } from "react-icons/fi";

const NewSubject = () => {
  const navigate = useNavigate();

  const BranchList = [
    { value: "IT", label: "Information Technology" },
    { value: "CSE", label: "Computer Engineering" },
  ];
  const [errorMsg, setErrorMsg] = useState("");

  const [name, setName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [description, setDescription] = useState("");
  const [branch, setBranch] = useState("");
  const [year, setYear] = useState(useParams().year || "");
  const [credits, setCredits] = useState("");
  const [tags, setTags] = useState("");
  const [professors, setProfessors] = useState([]);

  const [loading, setLoading] = useState(false);
  const addSubject = async () => {
    setLoading(true);
    let formattedTags =
      tags.length > 0 ? tags.split(",").map((tag) => tag.trim()) : [];
    try {
      const { data } = await api.post("/api/subjects/add_subject", {
        name,
        subject_code: subjectCode.toUpperCase(),
        description,
        branch,
        year,
        credits,
        tags: formattedTags,
        professors,
      });
      console.log(data);
      navigate("/");
    } catch (e) {
      console.log(e);
      setErrorMsg(e.response.data.msg);
    }
    setLoading(false);
  };

  const [suggestedTags, setSuggestedTags] = useState([]);
  const getCurrentSubjectTags = async () => {
    try {
      const { data } = await api.get(`/api/subjects/get_tags`);
      setSuggestedTags(data.tags);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    getCurrentSubjectTags();
  }, []);

  const [numOfGrpElements, setNumOfGrpElements] = useState([]);

  return (
    <div className="full-page new-subject-page p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="mb-2 text-dark font-medium">Add New Subject</h1>
        <p className="text-dark-2">
          Thank you for your interest in contributing to the community. Please
          fill in the details below to add a new subject.
        </p>
        <div className="my-10">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (subjectCode.match(/^[a-zA-Z]{3}[0-9]{3}$/)) addSubject();
              else setErrorMsg("Enter a valid Subject Code");
            }}
          >
            <Input
              label="Name"
              type="text"
              val={name}
              setVal={setName}
              required
            />
            <div className="flex gap-2 sm:gap-4 md:gap-8 my-5 sm:my-7">
              <Input
                label="Subject Code"
                type="text"
                val={subjectCode}
                setVal={setSubjectCode}
                required
                className="w-full"
              />
              <Select
                label="Branch"
                options={
                  <>
                    <option value="" disabled>
                      Select Branch
                    </option>
                    {BranchList.map((branch) => {
                      return (
                        <option key={branch.value} value={branch.value}>
                          {branch.label}
                        </option>
                      );
                    })}
                  </>
                }
                val={branch}
                setVal={setBranch}
                required
                className="w-full"
              />
            </div>
            <TextArea
              label="Description"
              rows={3}
              val={description}
              setVal={setDescription}
              required
            />
            <div className="flex gap-2 sm:gap-4 md:gap-8 my-5 sm:my-7">
              <Input
                label="Year"
                type="number"
                val={year}
                setVal={(newVal) => {
                  if (newVal <= 4 && newVal >= 1) setYear(newVal);
                }}
                required
                className="w-full"
              />
              <Input
                label="Credits"
                type="number"
                val={credits}
                setVal={setCredits}
                required
                className="w-full"
              />
            </div>
            <div className="my-8">
              <Input
                label="Tags"
                val={tags}
                setVal={setTags}
                className="w-full"
              />
              <div className="text-sm text-dark-2 flex items-center gap-2">
                <FiAlertCircle />
                Separate each tag by a comma (e.g. "gate, practicals")
              </div>
              {!!suggestedTags.length && (
                <>
                  <div className="text-sm text-dark-2 mt-2">
                    Suggested tags (please select these tags instead of creating
                    something similar to avoid redundancy in the backend)
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {suggestedTags.map((tag) => (
                      <div className="simple-tab tab-theme-default" key={tag}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="my-8 flex flex-col gap-3">
              {numOfGrpElements.map((num) => (
                <div
                  key={num}
                  className="flex flex-wrap xs:flex-nowrap gap-4 sm:gap-6 md:gap-8"
                >
                  <Input
                    label="Professor Name"
                    type="text"
                    val={professors[num]?.name || ""}
                    setVal={(val) => {
                      let temp = [...professors];
                      if (professors[num] === undefined)
                        temp.push({
                          name: val,
                          year: professors[num]?.year || "",
                        });
                      else temp[num].name = val;
                      setProfessors(temp);
                    }}
                    required
                    className="w-full"
                  />
                  <Input
                    label="Academic Year Taught"
                    type="number"
                    val={professors[num]?.year || ""}
                    setVal={(val) => {
                      let temp = [...professors];
                      if (professors[num] === undefined)
                        temp.push({
                          name: professors[num]?.name || "",
                          year: val,
                        });
                      else temp[num].year = val;
                      if (val <= new Date().getFullYear()) setProfessors(temp);
                    }}
                    required
                    className="w-full"
                  />
                </div>
              ))}
              <button
                className="btn btn-secondary w-full"
                type="button"
                onClick={() => {
                  setNumOfGrpElements([
                    ...numOfGrpElements,
                    numOfGrpElements.length,
                  ]);
                }}
              >
                Add Professor Field
              </button>
            </div>
            <div className="mt-8">
              {errorMsg && (
                <div className="text-red-500 text-end text-sm err-msg">
                  {errorMsg}
                </div>
              )}
              <button
                className="btn btn-primary"
                type="submit"
                disabled={loading}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewSubject;
