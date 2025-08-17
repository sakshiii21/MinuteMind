import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<App />} />
      </Routes>
    </Router>
  </StrictMode>
);
