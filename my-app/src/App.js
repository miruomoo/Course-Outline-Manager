import './App.css';
import { Routes, Route } from "react-router-dom";
import PreviousCourseOutlines from './PreviousCourseOutlines.js';
import NewCourseOutline from './newCourseOutline.js';
import HomePage from './homePage.js';
import Login from './login.js';
import AdminPage from './adminPage';
import EditCourseOutline from './editCourseOutline.js';
import Test from './test.js';
import GraduateAttributes from './GraduateAttributes';
import EditCourseOutlineInterface from './editCourseOutlineInterface.js';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Home" element={<HomePage />} />
        <Route path="/PreviousCourseOutlines" element={<PreviousCourseOutlines />} />
        <Route path="/NewCourseOutline" element={<NewCourseOutline />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/EditCourseOutline" element={<EditCourseOutline />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/GraduateAttributes" element={<GraduateAttributes />} />
        <Route path="/EditCourseOutlineInterface" element={<EditCourseOutlineInterface />} />
      </Routes>
    </div>
  );
}

export default App;
