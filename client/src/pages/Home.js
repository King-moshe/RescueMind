// src/pages/Home.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginPopup from "../components/login/LoginPopup";
import SignUpPopup from "../components/signup/SignUpPopup";
import { useAuth } from "../context/AouthContext";

export default function Home() {
  const { user, login, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  const handleNfcPairing = () => {
    alert("אנא קרב את המדבקה למכשיר שלך לצימוד NFC...");
  };
  const handleCameraPairing = () => {
    alert("אנא קרב את המצלמה למכשיר שלך לצימוד NFC...");
  };

  const handleLogin = (userData) => {
    if (userData) {
      login(userData);
      setShowLogin(false);
    } else {
      setShowSignUp(true);
    }
  };

  const handleRegister = (newUser) => {
    login(newUser);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <header className="flex justify-center items-center mb-4 w-full max-w-md">
        <h1 className="text-4xl font-bold text-blue-700">RescueMind</h1>
      </header>

      <main className="flex flex-col items-center">
        {!user ? (
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={() => setShowLogin(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md w-48"
            >
              התחברות
            </button>
            <button
              onClick={() => setShowSignUp(true)}
              className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md w-48"
            >
              הרשמה
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold mb-4">
              ברוך הבא, {user.name}
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handleNfcPairing}
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md mb-4 w-48"
              >
                צימוד מדבקה באמצעות NFC
              </button>
              <button
                onClick={handleCameraPairing}
                className="bg-zinc-500 text-white py-2 px-4 rounded-lg shadow-md mb-4 w-48"
              >
                צימוד מצלמה באמצעות NFC
              </button>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/patient-monitoring"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md w-48 text-center"
              >
                ניטור פצועים
              </Link>
              <Link
                to="/treatment-logs"
                className="bg-green-500 text-white py-2 px-4 rounded-lg shadow-md w-48 text-center"
              >
                תיעוד טיפולים
              </Link>
              <Link
                to="/ai-recommendations"
                className="bg-yellow-500 text-white py-2 px-4 rounded-lg shadow-md w-48 text-center"
              >
                המלצות AI
              </Link>
              <Link
                to="/hospital-integration"
                className="bg-red-500 text-white py-2 px-4 rounded-lg shadow-md w-48 text-center"
              >
                אינטגרציה לבית החולים
              </Link>
            </div>

            <button
              onClick={logout}
              className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow-md mt-4 w-48"
            >
              התנתקות
            </button>
          </>
        )}
      </main>

      <footer className="text-center text-gray-500 mt-6">
        <p>כל הזכויות שמורות &copy; RescueMind 2024</p>
      </footer>

      {showLogin && (
        <LoginPopup onClose={() => setShowLogin(false)} onLogin={handleLogin} />
      )}
      {showSignUp && (
        <SignUpPopup
          onClose={() => setShowSignUp(false)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
