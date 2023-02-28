import { useNavigate } from "react-router-dom";
import "./Terms.css";

const Terms = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="header items-center px-6 py-2 bg-white">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/assets/logo.webp" alt="logo" className="logo" />
          <h2>The Garden</h2>
        </div>
      </div>
      <div className="page-template">
        <div className="p-8 bg-white terms-page">
          <img src="/assets/terms.svg" alt="terms" />
          <div className="font-roboto text-sm mt-8 xs:px-4 sm:px-16">
            THE GARDEN TERMS OF SERVICE
          </div>
          <div className="py-8 xs:px-4 sm:px-16 text-dark-2">
            <h2 className="text-2xl font-medium mb-4">
              We know it’s tempting to skip these Terms of Service, but it’s
              important to establish what you can expect from us and what we
              expect from you.
            </h2>
            <div className="font-roboto">
              <p className="py-1">
                "The Garden" is an unofficial platform created and maintained by
                the students of Information Technology for the benefit of
                students attending College of Technology, GBPUAT.
              </p>
              <p className="py-1">
                This website is not affiliated with or endorsed by College of
                Technology, GBPUAT, and the information provided on this site is
                not guaranteed to be accurate or up-to-date. While we strive to
                ensure the quality and accuracy of the information provided, we
                do not take any responsibility for errors, omissions, or
                outdated information.
              </p>
              <p className="py-1">
                We take the privacy of our users seriously and are committed to
                protecting your personal information. "The Garden" may collect
                certain information from users, such as email addresses, in
                order to provide access to the platform and its resources. We
                will never share, sell, or otherwise distribute this information
                without your explicit consent, except where required by law.
                However, please be aware that no security measures are
                foolproof, and we cannot guarantee the absolute security of your
                data.
              </p>
              <p className="py-1">
                By using "The Garden," you acknowledge that you are doing so at
                your own risk and that you agree to hold the creators and
                maintainers of this site harmless for any damages, losses, or
                liabilities that may arise from the use of this website.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Terms;
