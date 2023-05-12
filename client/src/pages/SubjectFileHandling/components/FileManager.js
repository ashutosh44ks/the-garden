import jwt_decode from "jwt-decode";
import api from "../../../components/utils/api";

const FileManager = ({
  subjectId,
  list,
  setListFiles,
  setListTexts,
  getFile,
  setActiveItem,
  isLoading,
}) => {
  const userRole = jwt_decode(
    JSON.parse(localStorage.getItem("logged")).accessToken
  )?.role;

  const removeFile = async (dbFileName) => {
    try {
      const { data } = await api.delete(
        `/api/subjects/remove_file?subject_code=${subjectId}&dbFileName=${dbFileName}`
      );
      console.log(data);
      setListFiles((prev) => prev.filter((item) => item.val !== dbFileName));
    } catch (err) {
      console.log(err);
    }
  };
  const removeText = async (item_id) => {
    try {
      const { data } = await api.delete(
        `/api/subjects/remove_qp_text?subject_code=${subjectId}&item_id=${item_id}`
      );
      console.log(data);
      setListTexts((prev) => prev.filter((item) => item.key !== item_id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="file-manager">
      <table className="text-dark-2 text-sm w-full">
        <thead>
          <tr>
            <th className="text-left px-4 py-2">File Type</th>
            <th className="text-left px-4 py-2">File Name</th>
            <th className="text-left px-4 py-2">Uploaded On</th>
            <th className="text-left px-4 py-2">Uploaded By</th>
            {userRole && userRole !== "user" && <td className="px-4 py-2"></td>}
          </tr>
        </thead>
        <tbody>
          {isLoading
            ? [1, 2, 3, 4, 5].map((_) => (
                <tr className="">
                  <td
                    className="px-4 py-2 skeleton-loading h-[2rem]"
                    colSpan={userRole && userRole !== "user" ? 5 : 4}
                  ></td>
                </tr>
              ))
            : list.map((item) => (
                <tr
                  onClick={() => {
                    if (item.type !== "text") getFile(item);
                    else setActiveItem(item);
                  }}
                  className="cursor-pointer"
                  key={item.val}
                >
                  <td className="px-4 py-2">
                    <span className={`file-tag text-sm ${item.type}`}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-dark break-words">{item.name}</td>
                  <td className="px-4 py-2">{item.created_at}</td>
                  <td className="px-4 py-2">{item.uploader}</td>
                  {userRole && userRole !== "user" && (
                    <td
                      className="px-4 py-2 text-red-500"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item.type !== "text") removeFile(item.val);
                        else removeText(item.key);
                      }}
                    >
                      Remove
                    </td>
                  )}
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileManager;
