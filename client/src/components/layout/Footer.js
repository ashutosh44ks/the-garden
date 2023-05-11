import { Link, useNavigate } from "react-router-dom";

const Footer = () => {
  let navigate = useNavigate();

  return (
    <div className="bg-white footer">
      <div className="flex items-center gap-10 px-8 py-6 footer-links">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/assets/logo.webp" alt="logo" className="logo" />
          <h2>The Garden</h2>
        </div>
        <div className="flex items-center footer-items">
          <a
            className="hover-blue"
            target="_blank"
            rel="noopener noreferrer"
            href="https://gbpuat.ac.in/"
          >
            University site
          </a>
          <a
            className="hover-blue"
            target="_blank"
            rel="noopener noreferrer"
            href="https://gbpuat.auams.in/"
          >
            AUAMS site
          </a>
          <a
            className="hover-blue"
            target="_blank"
            rel="noopener noreferrer"
            href="http://www.gbpuat-tech.ac.in/"
          >
            College site
          </a>
          <Link className="hover-blue" to="about">
            About us
          </Link>
          <a
            className="hover-blue"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/ashutosh44ks/the-garden"
          >
            Github repository
          </a>
        </div>
      </div>
      <div className="flex items-center justify-between mx-8 py-6 separator-top footer-last">
        <div className="flex gap-3">
          <Link className="hover-blue" to="/terms">
            Terms
          </Link>
          <span className="cursor-default">|</span>
          <Link className="hover-blue" to="/terms">
            Privacy
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span>Contact us to report bugs or request features</span>
          <a
            className="btn-primary"
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/ashutosh44ks/the-garden/issues"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
