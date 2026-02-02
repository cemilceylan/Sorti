import { useState, useRef } from "react";
import { classifyImage } from "../scripts/model_loader";

export function HomePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [result, setResult] = useState<{ className: string; probability: number } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  //Refs for accessing DOM elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : undefined;
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setResult(null); // Clear previous result
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      setIsCameraOn(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera.");
      setIsCameraOn(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraOn(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/png");
        setPreview(dataUrl);
        setResult(null); // Clear previous result
        stopCamera(); 
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setResult(null);
    stopCamera(); // Ensure camera is off
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  const handleAnalyze = async () => {
    if (imgRef.current) {
      setIsAnalyzing(true);
      try {
        const prediction = await classifyImage(imgRef.current);
        setResult(prediction);
      } catch (error) {
        console.error("Analysis failed:", error);
        alert("Analysis failed. See console for details.");
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div>
      <h1>Upload or Capture Image</h1>

      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <img
            ref={imgRef}
            src={preview}
            alt="preview"
            width="300"
            style={{ display: "block", marginBottom: "10px", borderRadius: "8px" }}
          />
          <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
            <button onClick={handleAnalyze} disabled={isAnalyzing}>
                {isAnalyzing ? "Analyzing..." : "Analyze Trash"}
            </button>
            <button onClick={handleRemove} disabled={isAnalyzing}>Remove Image</button>
          </div>

          {result && (
            <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #4CAF50', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
                <h3>Result:</h3>
                <p><strong>Type:</strong> {result.className.toUpperCase()}</p>
                <p><strong>Confidence:</strong> {(result.probability * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      )}

      {!preview && (
        <div style={{ marginBottom: "20px", border: "1px dashed #ccc", padding: "10px" }}>
          {!isCameraOn ? (
            <button onClick={startCamera}>Open Camera</button>
          ) : (
            <div>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                width="300"
                style={{ display: "block", marginBottom: "10px", borderRadius: "8px" }}
              />
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={capturePhoto}>Take Photo</button>
                <button onClick={stopCamera}>Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      <hr />

      <p>Or upload from device:</p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}

export default HomePage;
