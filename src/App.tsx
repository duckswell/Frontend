import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyle";
import Home from "./routes/Home";
import Mypage from "./routes/Mypage";
import CourseHistories from "./routes/CourseHistories";
import SafetyGuide from "./routes/SafetyGuide";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my" element={<Mypage />} />
        <Route path="/history" element={<CourseHistories />} />
        <Route path="/safety" element={<SafetyGuide />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
