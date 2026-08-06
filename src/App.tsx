import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalStyle } from "./GlobalStyle";
import Home from "./routes/Home";
import Care from "./routes/Care";

function App() {
  return (
    <BrowserRouter>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/care" element={<Care />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
