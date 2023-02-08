import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/utils/ProtectedRoute";
import Home from "./pages/Home";
import Entry from "./pages/Entry";
import Subject from "./pages/Subject";
import Professor from "./pages/Professor";
import Error404 from "./pages/Error404";
import SubjectView from "./pages/SubjectView";
// import UploadQP from "./pages/UploadQP";
// import ViewQP from "./pages/ViewQP";

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
          path="/subject/:subjectId"
          element={
            <ProtectedRoute>
              <Subject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/professor/:professorCode"
          element={
            <ProtectedRoute>
              <Professor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/subject/:subjectId/view_syllabus"
          element={
            <ProtectedRoute>
              <SubjectView />
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/question_papers/upload"
          element={
            <ProtectedRoute>
              <UploadQP />
            </ProtectedRoute>
          }
        />
        <Route
          path="/question_papers/view"
          element={
            <ProtectedRoute>
              <ViewQP />
            </ProtectedRoute>
          }
        /> */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Router>
  );
}

export default App;
