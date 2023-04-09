const FileManager = ({ fileList, getFile }) => {
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
          {fileList.map((file) => (
            <tr
              onClick={() => getFile(file)}
              className="cursor-pointer"
              key={file.val}
            >
              <td className="px-4 py-2">
                <span className={`file-tag text-sm ${file.type}`}>
                  {file.type}
                </span>
              </td>
              <td className="px-4 py-2 text-dark">{file.name}</td>
              <td className="px-4 py-2">{file.created_at}</td>
              <td className="px-4 py-2">{file.uploader}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileManager;
