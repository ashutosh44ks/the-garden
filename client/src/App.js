import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Home from "./pages/Home";
import Entry from "./pages/Entry";
import Subject from "./pages/Subject";
import NewSubject from "./pages/Subject/NewSubject";
import ViewCalendar from "./pages/Calendar";
import UploadCalendar from "./pages/Calendar/CalendarUpload";
import Error404 from "./pages/Error404";
import Profile from "./pages/Profile";
import Terms from "./pages/Terms";
import SubjectUploadQP from "./pages/SubjectFileHandling/SubjectUploadQP";
import SubjectView from "./pages/SubjectFileHandling/SubjectView";
import SubjectUpload from "./pages/SubjectFileHandling/SubjectUpload";

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
          path="/subject/:subjectId/qp/upload"
          element={
            <ProtectedRoute>
              <SubjectUploadQP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/:category/view"
          element={
            <ProtectedRoute>
              <SubjectView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/:category/upload"
          element={
            <ProtectedRoute>
              <SubjectUpload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendars/:calendarType"
          element={
            <ProtectedRoute>
              <ViewCalendar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendars/:calendarType/upload"
          element={
            <ProtectedRoute>
              <UploadCalendar />
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
