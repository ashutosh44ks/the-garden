import { useState, useEffect } from "react";
import api from "./api";

export default function useActivateBackend() {

  const [activeBackend, setActiveBackend] = useState(false);

  useEffect(() => {
    var interval = 10000; // Initial interval in milliseconds
    var multiplier = 0.85;
    let flag = false;
    const checkServer = async () => {
      try {
        const { data } = await api.get("/");
        console.log(data);
        flag = true;
        setActiveBackend(true);
      } catch (err) {
        console.log(err);
        flag = false;
      }
    };

    function recursiveCheck() {
      console.log("checking server...");
      checkServer();
      // Reset and update interval
      clearInterval(checker);
      if (!flag && interval > 1000) {
        interval = interval * multiplier;
        checker = setInterval(recursiveCheck, interval);
      }
    }
    var checker = setInterval(recursiveCheck, interval);
    return () => clearInterval(recursiveCheck);
  }, []);

  return activeBackend;
}
