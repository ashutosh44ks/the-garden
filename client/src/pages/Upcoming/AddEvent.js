import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import Input from "../../components/common/MUI-themed/Input";
import TextArea from "../../components/common/MUI-themed/TextArea";

const UploadQP = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [link, setLink] = useState("");
  const [expectedDate, setExpectedDate] = useState("");
  const addEvent = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(`/api/misc/add_event`, {
        event: {
          name,
          type,
          description: desc,
          link,
          expected_date: expectedDate,
        },
      });
      console.log(data);
      setMsg(data.msg);
      setName("");
      setType("");
      setDesc("");
      setLink("");
      setExpectedDate("");
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  return (
    <div className="p-8 bg-white">
      <div className="xs:px-4 sm:py-8 xs:px-4 sm:px-12">
        <h1 className="text-dark font-medium">Add Event</h1>
        <p className="text-dark-2">Add an event to the upcoming events list</p>
        <div className="text-sm text-dark-2">
          Go back to{" "}
          <u
            className="text-blue cursor-pointer"
            onClick={() => {
              navigate("/upcoming");
            }}
          >
            Events page
          </u>
        </div>
        <form
          className="my-10"
          onSubmit={(e) => {
            e.preventDefault();
            addEvent();
          }}
        >
          <Input
            label="Event name"
            type="text"
            val={name}
            setVal={setName}
            className="mb-4"
            required
          />
          <Input
            label="Event type"
            type="text"
            val={type}
            setVal={setType}
            className="mb-4"
            required
          />
          <TextArea
            label="Description"
            rows={3}
            val={desc}
            setVal={setDesc}
            className="mb-4"
            required
          />
          <Input
            label="Expected date"
            type="text"
            val={expectedDate}
            setVal={setExpectedDate}
            className="mb-4"
            required
          />
          <Input
            label="Link (if any)"
            type="text"
            val={link}
            setVal={setLink}
            className="mb-4"
          />
          <div className="text-green-500 relative">
            <div className="absolute right-0">{msg}</div>
          </div>
          <div className="mt-4">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading}
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadQP;
