import { Link } from "react-router-dom";
import truncateString from "../../../components/utils/truncateString";
import toLabel from "../../../components/utils/toLabel";

const PlaceholderCards = () => {
  return [1, 2, 3, 4, 5].map((item) => (
    <div className="subject card" key={item}>
      <div className="card-body">
        <div className="mb-2">
          <h3 className="card-title skeleton-loading">{}</h3>
          <div className="card-subtitle text-sm skeleton-loading"></div>
        </div>
        <div className="card-text">
          <div className="skeleton-loading"></div>
          <div className="skeleton-loading"></div>
          <div className="skeleton-loading"></div>
        </div>
      </div>
      <div className="card-footer flex gap-2">
        {[1, 2, 3].map((tag) => (
          <span className="small-tab skeleton-loading" key={tag}></span>
        ))}
      </div>
    </div>
  ));
};

const SubjectGrid = ({ subjects, userRole, loading, year }) => {
  return (
    <div className="flex flex-wrap items-stretch gap-4 my-5">
      {loading ? (
        <PlaceholderCards />
      ) : (
        <>
          {subjects.map((subject) => (
            <Link
              className="subject card"
              to={`/subject/${subject.subject_code}`}
              key={subject.subject_code}
            >
              <div className="card-body">
                <div className="mb-2">
                  <h3 className="card-title">{subject.name}</h3>
                  <div className="card-subtitle text-sm text-grey-500">
                    {subject.subject_code}
                  </div>
                </div>
                <p className="card-text">
                  {truncateString(subject.description, 120)}
                </p>
              </div>
              <div className="card-footer flex gap-2">
                <span className="small-tab">{subject.credits} credits</span>
                {subject.tags.slice(0, 4).map((tag) => (
                  <span className="small-tab" key={tag}>
                    {toLabel(tag)}
                  </span>
                ))}
              </div>
            </Link>
          ))}
          {userRole === "admin" || userRole === "moderator" ? (
            <Link className="subject card" to={`/subject/new_subject/${year}`}>
              <div className="card-body">
                <div className="mb-2">
                  <h3 className="card-title">Add New Subject</h3>
                  <div className="card-subtitle text-sm text-grey-500">
                    This method is only available to admins and moderators.
                  </div>
                </div>
                <p className="card-text">
                  Admins can directly add new subjects to the database but
                  moderators will need approval from admins for the same.
                </p>
              </div>
            </Link>
          ) : (
            subjects.length === 0 && (
              <div className="my-5 text-dark-2">
                No Subjects found. Request admin to add missing subject(s) by
                clicking{" "}
                <a
                  className="text-blue"
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://github.com/ashutosh44ks/the-garden/issues"
                >
                  here
                </a>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};

export default SubjectGrid;
