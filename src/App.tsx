import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyle";
import Home from "./routes/Home";
import Mypage from "./routes/Mypage";
import CourseHistories from "./routes/CourseHistories";
import SafetyGuide from "./routes/SafetyGuide";
import NewProcedure from "./routes/NewProcedure";
import Care from "./routes/Care";
import FirstFocusCare from "./routes/FirstFocusCare";
import SecondFocusCare from "./routes/SecondFocusCare";
import ThirdFocusCare from "./routes/ThirdFocusCare";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/my" element={<Mypage />} />
        <Route path="/history" element={<CourseHistories />} />
        <Route path="/safety" element={<SafetyGuide />} />
        <Route path="/add" element={<NewProcedure />} />
        <Route path="/care" element={<Care />} />
        <Route path="/care/first_focus_care" element={<FirstFocusCare />} />
        <Route path="/care/second_focus_care" element={<SecondFocusCare />} />
        <Route path="/care/third_focus_care" element={<ThirdFocusCare />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
