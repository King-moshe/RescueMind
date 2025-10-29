// src/components/common/Navbar.js
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { MenuIcon } from "@heroicons/react/solid";

export default function Navbar() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-blue-600 w-full min-h-6">
      {/* Desktop Navigation */}
      <nav className="bg-blue-600 p-4 hidden md:block">
        <ul className="flex justify-around text-white font-medium">
          <li>
            <Link
              to="/"
              className={`px-4 py-2 hover:bg-blue-500 rounded ${
                location.pathname === "/" ? "bg-blue-500" : ""
              }`}
            >
              דף הבית
            </Link>
          </li>
          <li>
            <Link
              to="/patient-monitoring"
              className={`px-4 py-2 hover:bg-blue-500 rounded ${
                location.pathname === "/patient-monitoring" ? "bg-blue-500" : ""
              }`}
            >
              ניטור פצועים
            </Link>
          </li>
          <li>
            <Link
              to="/treatment-logs"
              className={`px-4 py-2 hover:bg-blue-500 rounded ${
                location.pathname === "/treatment-logs" ? "bg-blue-500" : ""
              }`}
            >
              תיעוד טיפולים
            </Link>
          </li>
          <li>
            <Link
              to="/ai-recommendations"
              className={`px-4 py-2 hover:bg-blue-500 rounded ${
                location.pathname === "/ai-recommendations" ? "bg-blue-500" : ""
              }`}
            >
              המלצות AI
            </Link>
          </li>
          <li>
            <Link
              to="/hospital-integration"
              className={`px-4 py-2 hover:bg-blue-500 rounded ${
                location.pathname === "/hospital-integration"
                  ? "bg-blue-500"
                  : ""
              }`}
            >
              אינטגרציה לבית החולים
            </Link>
          </li>
        </ul>
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden block p-4">
        <MenuIcon
          className="h-8 w-8 text-white cursor-pointer"
          onClick={toggleMenu}
        />
        {isMenuOpen && (
          <nav className="bg-blue-600 p-4">
            <ul className="text-white font-medium">
              <li className="mb-4">
                <Link
                  to="/"
                  className={`px-4 py-2 hover:bg-blue-500 rounded ${
                    location.pathname === "/" ? "bg-blue-500" : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  דף הבית
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/patient-monitoring"
                  className={`px-4 py-2 hover:bg-blue-500 rounded ${
                    location.pathname === "/patient-monitoring"
                      ? "bg-blue-500"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  ניטור פצועים
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/treatment-logs"
                  className={`px-4 py-2 hover:bg-blue-500 rounded ${
                    location.pathname === "/treatment-logs"
                      ? "bg-blue-500"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  תיעוד טיפולים
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/ai-recommendations"
                  className={`px-4 py-2 hover:bg-blue-500 rounded ${
                    location.pathname === "/ai-recommendations"
                      ? "bg-blue-500"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  המלצות AI
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/hospital-integration"
                  className={`px-4 py-2 hover:bg-blue-500 rounded ${
                    location.pathname === "/hospital-integration"
                      ? "bg-blue-500"
                      : ""
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  אינטגרציה לבית החולים
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
