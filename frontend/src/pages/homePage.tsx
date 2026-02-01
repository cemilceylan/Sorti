import { useState, useRef } from "react";

export function HomePage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  //Refs for accessing DOM elements
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : undefined;
    if (file) {
      stopCamera();
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
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
        stopCamera(); 
      }
    }
  };

  const handleRemove = () => {
    setPreview(null);
    stopCamera(); // Ensure camera is off
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear file input
    }
  };

  return (
    <div>
      <h1>Upload or Capture Image</h1>

      {preview && (
        <div style={{ marginBottom: "20px" }}>
          <img
            src={preview}
            alt="preview"
            width="300"
            style={{ display: "block", marginBottom: "10px", borderRadius: "8px" }}
          />
          <button onClick={handleRemove}>Remove Image</button>
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