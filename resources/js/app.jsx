import React from "react";
import { createRoot } from "react-dom/client";
import Main from "./src/main.jsx";

const el = document.getElementById("app");
if (el) createRoot(el).render(<Main />);
