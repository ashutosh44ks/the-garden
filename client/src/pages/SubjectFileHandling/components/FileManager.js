const FileManager = ({ list, getFile, setActiveItem }) => {
  return (
    <div className="file-manager">
      <table className="text-dark-2 text-sm w-full">
        <thead>
          <tr>
            <th className="text-left px-4 py-2">File Type</th>
            <th className="text-left px-4 py-2">File Name</th>
            <th className="text-left px-4 py-2">Uploaded On</th>
            <th className="text-left px-4 py-2">Uploaded By</th>
          </tr>
        </thead>
        <tbody>
          {list.map((item) => (
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
              <td className="px-4 py-2 text-dark">{item.name}</td>
              <td className="px-4 py-2">{item.created_at}</td>
              <td className="px-4 py-2">{item.uploader}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileManager;
