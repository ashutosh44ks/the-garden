import { storage } from "./firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
} from "firebase/storage";

export const createFilePath = (path, mimetype) => {
  if (
    mimetype.split("/")[1] ===
    "vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return `${path}.docx`;
  else return `${path}.${mimetype.split("/")[1]}`;
};
const fileFilter = (mimetype, size) => {
  const allowedMimeTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/jpeg",
    "image/png",
    "image/jpg",
  ];
  if (size > 15 * 1024 * 1024)
    // 15MB
    return {
      status: false,
      msg: "File size exceeded",
      constraint: "15MB",
    };
  if (allowedMimeTypes.includes(mimetype))
    return { status: true }; // accept file
  else {
    return {
      status: false,
      msg: "Forbidden extension",
      constraint: allowedMimeTypes,
    };
  }
};
// Upload file to Firebase Storage
export const uploadFileToStorage = async (file, path) => {
  const fileFilterData = fileFilter(file.type, file.size);
  if (!fileFilterData.status) return fileFilterData;

  let filePath = createFilePath(path, file.type);
  const subjectDirRef = ref(storage, filePath);
  await uploadBytes(subjectDirRef, file);
  const downloadUrl = await getDownloadURL(subjectDirRef);
  return {
    status: true,
    downloadUrl,
  };
};

// Download file from Firebase Storage
export const getDownloadUrlFromPath = async (path) => {
  return await getDownloadURL(ref(storage, path));
};

// Delete file from Firebase Storage
export const removeFileFromStorage = async (path) => {
  // Create a reference to the file to delete
  const fileRef = ref(storage, path);
  await deleteObject(fileRef);
};
