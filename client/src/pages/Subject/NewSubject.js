import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import Input from "../../components/common/MUI-themed/Input";
import Select from "../../components/common/MUI-themed/Select";
import TextArea from "../../components/common/MUI-themed/TextArea";

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
  const [year, setYear] = useState("");
  const [credits, setCredits] = useState("");
  const [tags, setTags] = useState("");
  const [professors, setProfessors] = useState([]);

  const addSubject = async () => {
    try {
      const { data } = await api.post("/api/subjects/add_subject", {
        name,
        subject_code: subjectCode,
        description,
        branch,
        year,
        credits,
        tags,
        professors,
      });
      console.log(data);
      navigate("/");
    } catch (e) {
      console.log(e);
      setErrorMsg(e.response.data.msg);
    }
  };

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
              addSubject();
            }}
          >
            <Input
              label="Name"
              type="text"
              val={name}
              setVal={setName}
              required
            />
            <div className="flex gap-2 sm:gap-4 md:gap-8 py-3 sm:py-6">
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
            <div className="flex gap-2 sm:gap-4 md:gap-8 py-3 sm:py-6">
              <Input
                label="Year"
                type="number"
                val={year}
                setVal={setYear}
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
            <div className="my-1">
              <Input
                label="Tags"
                val={tags}
                setVal={setTags}
                required
                className="w-full"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {!!tags.length &&
                  tags.split(",").map((tag) => (
                    <div className="simple-tab tab-theme-default" key={tag}>
                      {tag}
                    </div>
                  ))}
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3">
              {numOfGrpElements.map((num) => (
                <div
                  key={num}
                  className="flex flex-wrap xs:flex-nowrap gap-2 sm:gap-4 md:gap-8"
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
                      setProfessors(temp);
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
            {errorMsg && (
              <div className="text-red-500 text-end text-sm err-msg">
                {errorMsg}
              </div>
            )}
            <div className="mt-8">
              <button className="btn btn-primary" type="submit">
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
