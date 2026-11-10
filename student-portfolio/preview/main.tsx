import { createRoot } from "react-dom/client";
import Home from "../app/page";
import "../app/globals.css";
import "../app/journey-theme.css";
import "../app/water-journey.css";

// Use the real page so the HTML preview stays in sync with the application.
const root = document.getElementById("portfolio-root");
if (!root) throw new Error("Portfolio preview root was not found.");
createRoot(root).render(<Home />);
