import { useState, useRef } from "react";
import { classifyImage } from "../scripts/model_loader";
import '../App.css';

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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Prefer back camera on mobile
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access camera. Please allow permissions.");
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

  // Trash Separation Mapping
  const DISPOSAL_INFO: Record<string, string> = {
    battery: "🔋 Battery Collection (Retail / Recycling Center)",
    biological: "🍏 Bio Waste (Green/Brown Bin)",
    cardboard: "📦 Paper/Cardboard (Blue Bin)",
    clothes: "👕 Textile Container / Donation",
    glass: "🍾 Glass Container (sorted by color)",
    metal: "🥫 Recycling Bin (Yellow Bin/Bag)",
    paper: "📄 Paper (Blue Bin)",
    plastic: "🥤 Recycling Bin (Yellow Bin/Bag)",
    shoes: "👞 Textile Container (tied in pairs)"
  };

  return (
    <div className="app-container">
      {!preview && !isCameraOn && (
          <h1>Sorti Scanner</h1>
      )}

      {/* Preview Section (Image Loaded/Taken) */}
      {preview && (
        <div className="preview-section">
          <img
            ref={imgRef}
            src={preview}
            alt="Trash Preview"
            className="preview-image"
          />
          
          <div className="btn-group">
            <button 
                className="btn btn-primary" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing}
            >
                {isAnalyzing ? "Analyzing..." : "Identify Item"}
            </button>
            <button 
                className="btn btn-secondary" 
                onClick={handleRemove} 
                disabled={isAnalyzing}
            >
                Reset
            </button>
          </div>

          {result && (
            <div className="result-card">
                <div className="result-title">Detected Item</div>
                <div className="result-value">{result.className.toUpperCase()}</div>
                
                <div className="disposal-info" style={{ marginTop: '10px', fontWeight: 'bold', color: '#1B5E20' }}>
                  <span>Where does it go? </span>
                  <div style={{ fontSize: '1.2rem', marginTop: '4px' }}>
                    {DISPOSAL_INFO[result.className] || "❓ Unknown"}
                  </div>
                </div>

                <div className="result-confidence" style={{ marginTop: '8px' }}>Confidence: {(result.probability * 100).toFixed(1)}%</div>
            </div>
          )}
        </div>
      )}

      {/* Camera/Upload Section */}
      {!preview && (
        <div className="camera-section">
          
          {/* Live Camera View */}
          {isCameraOn ? (
            <div className="camera-active-wrapper">
                <div className="camera-container">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                  />
                </div>
                <div className="btn-group">
                    <button className="btn btn-primary" onClick={capturePhoto}>Capture</button>
                    <button className="btn btn-secondary" onClick={stopCamera}>Cancel</button>
                </div>
            </div>
          ) : (
             // Initial State: Buttons to start
             <div className="initial-actions">
                <button className="btn btn-primary mb-4" onClick={startCamera}>
                    Open Camera
                </button>
                
                <div className="file-input-wrapper">
                    <span className="file-input-label">Or upload from gallery</span>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="file-input"
                    />
                </div>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;