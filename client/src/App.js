import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Home from "./pages/Home";
import Entry from "./pages/Entry";
import Subject from "./pages/Subject";
import NewSubject from "./pages/Subject/NewSubject";
import ViewSyllabus from "./pages/Subject/ViewSyllabus";
import ViewCalendar from "./pages/ViewCalendar";
import Error404 from "./pages/Error404";
import ViewNotes from "./pages/Subject/ViewNotes";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import UploadQP from "./pages/SubjectUpload/UploadQP";
// import ViewQP from "./pages/SubjectUpload/ViewQP";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/entry" element={<Entry />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/new_subject"
          element={
            <ProtectedRoute>
              <NewSubject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId"
          element={
            <ProtectedRoute>
              <Subject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/view_syllabus"
          element={
            <ProtectedRoute>
              <ViewSyllabus />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/view_notes"
          element={
            <ProtectedRoute>
              <ViewNotes />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/upload_qp"
          element={
            <ProtectedRoute>
              <UploadQP />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/question_papers/view"
          element={
            <ProtectedRoute>
              <ViewQP />
            </ProtectedRoute>
          }
        /> */}
        <Route
          path="/calendars/:calendarType"
          element={
            <ProtectedRoute>
              <ViewCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/terms" element={<Terms />} />
        <Route
          path="*"
          element={
            <ProtectedRoute>
              <Error404 />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
