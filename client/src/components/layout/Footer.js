import { useNavigate } from "react-router-dom";

const Footer = () => {
  let navigate = useNavigate();

  return (
    <div className="bg-white footer">
      <div className="flex items-center gap-10 px-8 py-6">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/assets/logo.webp" alt="logo" className="logo" />
          <h2>The Garden</h2>
        </div>
        <ul className="flex items-center gap-10">
          <li
            className="cursor-pointer hover-blue"
            onClick={() => (window.location.href = "https://gbpuat.ac.in/")}
          >
            University site
          </li>
          <li
            className="cursor-pointer hover-blue"
            onClick={() => (window.location.href = "gbpuat.auams.in")}
          >
            AUAMS site
          </li>
          <li
            className="cursor-pointer hover-blue"
            onClick={() =>
              (window.location.href = "http://www.gbpuat-tech.ac.in/")
            }
          >
            College site
          </li>
          <li
            className="cursor-pointer hover-blue"
            onClick={() => navigate("/about")}
          >
            About us
          </li>
          <li
            className="cursor-pointer hover-blue"
            onClick={() =>
              (window.location.href =
                "https://github.com/ashutosh44ks/the-garden")
            }
          >
            Github repository
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-between mx-8 py-6 separator-top">
        <div className="flex gap-3">
          <span className="cursor-pointer hover-blue">Terms</span>
          <span className="cursor-default">|</span>
          <span className="cursor-pointer hover-blue">Privacy</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Contact us to report bugs or request features</span>
          <button className="btn-primary">Contact Us</button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
