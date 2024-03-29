import { storage } from "./firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getMetadata,
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

  const fileRef = ref(storage, path);
  await uploadBytes(fileRef, file);
  const downloadUrl = await getDownloadURL(fileRef);
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

// Delete All files from Firebase Storage
export const removeDirFromStorage = async (path) => {
  const rootRef = ref(storage, path);
  // recursively delete all files from path directory
  const deleteAllFiles = async (dirRef) => {
    const res = await listAll(dirRef);
    // delete each file
    for (const item of res.items) {
      await deleteObject(item);
    }
    // recursively delete all files from sub-directories
    for (const item of res.prefixes) {
      await deleteAllFiles(item);
    }
  };
  await deleteAllFiles(rootRef);
};

// Get all files from storage
export const getAllFiles = async () => {
  const rootRef = ref(storage, "/");
  // recursively get all files from root directory
  const listAllFiles = async (dirRef) => {
    let files = [];
    const res = await listAll(dirRef);
    // get metadata of each file
    for (const item of res.items) {
      const metadata = await getMetadata(item);
      files.push(metadata);
    }
    // recursively get all files from sub-directories
    for (const item of res.prefixes) {
      const subFiles = await listAllFiles(item);
      files = files.concat(subFiles);
    }
    return files;
  };
  return await listAllFiles(rootRef);
};
