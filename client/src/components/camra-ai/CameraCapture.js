// src/components/camera-ai/CameraCapture.js
import React, { useRef, useState } from 'react';

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const [image, setImage] = useState(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('image/jpeg');
    setImage(imageData);
    onCapture(imageData); // שולח את התמונה לקומפוננטה הראשית
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 rounded-lg shadow-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-blue-600">צלם תמונה</h2>

      {/* תצוגת וידאו */}
      <video
        ref={videoRef}
        autoPlay
        className={`w-full rounded-md ${image ? 'hidden' : 'block'}`}
      />

      {/* התמונה שנלכדה */}
      {image && (
        <img
          src={image}
          alt="captured"
          className="w-full max-w-xs rounded-md border border-gray-300 shadow-md mb-4"
        />
      )}

      {/* כפתורים */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={startCamera}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition duration-300 ml-2"
        >
          הפעל מצלמה
        </button>
        <button
          onClick={captureImage}
          className="bg-green-500 text-white py-2 px-4 rounded-lg shadow hover:bg-green-600 transition duration-300"
        >
          צלם תמונה
        </button>
      </div>
    </div>
  );
}


