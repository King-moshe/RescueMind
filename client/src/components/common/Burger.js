import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Burger() {
  const location = useLocation();

  return (
    <nav className="bg-blue-600 p-4 md:hidden block">
      <ul className=" text-white font-medium">
        <li className="mb-4">
          <Link
            to="/"
            className={` px-4 py-2 hover:bg-blue-500 rounded ${
              location.pathname === "/" ? "bg-blue-500" : ""
            }`}
          >
            דף הבית
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/patient-monitoring"
            className={`px-4 py-2 hover:bg-blue-500 rounded ${
              location.pathname === "/patient-monitoring" ? "bg-blue-500" : ""
            }`}
          >
            ניטור פצועים
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/treatment-logs"
            className={`px-4 py-2 hover:bg-blue-500 rounded ${
              location.pathname === "/treatment-logs" ? "bg-blue-500" : ""
            }`}
          >
            תיעוד טיפולים
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/ai-recommendations"
            className={`px-4 py-2 hover:bg-blue-500 rounded ${
              location.pathname === "/ai-recommendations" ? "bg-blue-500" : ""
            }`}
          >
            המלצות AI
          </Link>
        </li>
        <li className="mb-4">
          <Link
            to="/hospital-integration"
            className={`px-4 py-2 hover:bg-blue-500 rounded ${
              location.pathname === "/hospital-integration" ? "bg-blue-500" : ""
            }`}
          >
            אינטגרציה לבית החולים
          </Link>
        </li>
      </ul>
    </nav>
  );
}
