import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/utils/api";
import truncateString from "../../components/utils/truncateString";
import jwt_decode from "jwt-decode";

const Upcoming = () => {
  const navigate = useNavigate();

  const [list, setList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const getUpcomingEvents = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/api/misc/get_events");
      setList(data);
    } catch (err) {
      console.log(err);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    getUpcomingEvents();
  }, []);

  const userRole = jwt_decode(
    JSON.parse(localStorage.getItem("logged")).accessToken
  )?.role;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-dark font-medium">Upcoming Events</h1>
          <p className="text-dark-2">
            Check out the upcoming events in your hostel and college
          </p>
        </div>
        {userRole && userRole !== "user" && (
          <div>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/add_event")}
            >
              Add Event
            </button>
          </div>
        )}
      </div>
      <div className="my-5 card">
        <div className="card-body">
          <table className="text-dark-2 text-sm w-full">
            <thead>
              <tr>
                <th className="text-left px-4 py-2">Event Name</th>
                <th className="text-left px-4 py-2">Type</th>
                <th className="text-left px-4 py-2">Description</th>
                <th className="text-left px-4 py-2">Expected Date</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? [1, 2, 3, 4, 5].map((_) => (
                    <tr className="" key={_}>
                      <td
                        className="px-4 py-2 skeleton-loading h-[2rem]"
                        colSpan={4}
                      ></td>
                    </tr>
                  ))
                : list.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 text-dark cursor-pointer">
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {item.name}
                        </a>
                      </td>
                      <td className="px-4 py-2">{item.type}</td>
                      <td className="px-4 py-2" title={item.description}>
                        {truncateString(item.description, 45)}
                      </td>
                      <td className="px-4 py-2">{item.expected_date}</td>
                    </tr>
                  ))}
              {list.length === 0 && (
                <tr>
                  <td
                    className="px-4 py-2 text-dark-2 cursor-pointer text-center"
                    colSpan={4}
                  >
                    No upcoming events
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Upcoming;
