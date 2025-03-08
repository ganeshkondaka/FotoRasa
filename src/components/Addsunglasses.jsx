import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const Addsunglasses = ({ imgsrc }) => {
  const [imageSrc, setImageSrc] = useState(imgsrc);
  const [isLoading, setIsLoading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // Handle image upload
  useEffect(() => {
    const handleImageUpload = () => {
      setImageSrc(imgsrc);
    };

    handleImageUpload();
  }, [imgsrc]);

  // Load models and apply sunglasses
  const addSunglasses = async () => {
    setIsLoading(true);
    try {
      const img = imageRef.current;
      const canvas = canvasRef.current;

      if (!img || !canvas) return;

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Load models from CDN
      const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

      const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

      if (!detections) {
        alert("No face detected!");
        setIsLoading(false);
        return;
      }

      const landmarks = detections.landmarks;
      const leftEye = landmarks.getLeftEye();
      const rightEye = landmarks.getRightEye();

      // Calculate position & size of sunglasses
      const glassesWidth = rightEye[3]._x - leftEye[0]._x + 40;
      const glassesHeight = glassesWidth / 2;
      const x = leftEye[0]._x - 20;
      const y = leftEye[0]._y - glassesHeight / 3;

      const sunglasses = new Image();
      // sunglasses.src = "https://www.pinclipart.com/picdir/big/554-5547309_sticker-goggles-sunglasses-eyewear-sunglass-free-download-sunglasses.png"; // Transparent sunglasses PNG
      sunglasses.src = "https://openclipart.org/image/2400px/svg_to_png/236678/Red-Sunglasses.png"; // Transparent sunglasses PNG
      sunglasses.onload = () => {
        ctx.drawImage(sunglasses, x, y, glassesWidth, glassesHeight);


        
        setIsLoading(false);
      };
    } catch (error) {
      console.error("Error processing image:", error);
      alert("An error occurred while processing the image");
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 text-center">
      <button
        onClick={addSunglasses}
        className={`px-4 py-2 rounded ${isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
          } text-white transition-colors`}
        disabled={isLoading || !imageSrc}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
        ) : 'Add Sunglasses'}
      </button>
      {imageSrc && (
        <div style={{ position: "relative", display: "inline-block", marginTop: "20px" }}>
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Face"
            style={{ display: "block", maxWidth: "100%" }}
          />
          <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0 }}
          />
        </div>
      )}
    </div>
  );
};

export default Addsunglasses;