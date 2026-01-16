import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <div className="page">
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Optional: redirect all other routes to Home */}
        <Route path="*" element={<Home />} />
      </Routes>
    </div>
  );
}
