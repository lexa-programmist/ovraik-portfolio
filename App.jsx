import { Routes, Route } from "react-router-dom";
import HomePage from "./HomePage.jsx";
import FishkaCaseStudy from "./FishkaCaseStudy.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fishka" element={<FishkaCaseStudy />} />
    </Routes>
  );
}
