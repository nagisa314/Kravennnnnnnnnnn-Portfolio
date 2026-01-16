import React from "react";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";

// ✅ Import global CSS (this is what makes Satoshi + all styles load)
import "../../css/app.css";

export default function Main() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
