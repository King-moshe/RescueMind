// src/components/AIRecommendations.js
import React, { useState } from "react";
import CameraCapture from "../components/camra-ai/CameraCapture";
import ResultDisplay from "../components/camra-ai/ResultDisplay";

export default function AIRecommendations() {
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleCapture = async (imageSrc) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('image', dataURItoBlob(imageSrc), 'capturedImage.jpg');

      const res = await fetch("http://localhost:5000/api/images/predict", {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.status === "success" && data.data && data.data.analysis) {
        setPrediction({
          response: data.data.analysis, // ניגש לשדה הנכון בתגובה
        });
      } else {
        throw new Error("Invalid server response structure");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setError("אירעה שגיאה בעיבוד התמונה. נסה שוב.");
    }
  };

  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">המלצות מבוססות AI</h2>
      <CameraCapture onCapture={handleCapture} />
      {error && <p className="text-red-500">{error}</p>}
      {prediction && <ResultDisplay prediction={prediction} />}
    </div>
  );
}
