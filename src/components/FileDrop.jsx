import { useState, useRef, useEffect } from "react";

function FileDrop() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const workerRef = useRef(null);

  useEffect(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/textWorker.js", import.meta.url)
      );
    }

    workerRef.current.onmessage = (e) => {
      const data = e.data;

      if (data.error) {
        setError(data.error);
        setResult(null);
      } else {
        setError("");
        setResult(data);
      }
    };
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();

    const file = e.dataTransfer.files[0];

    if (!file) {
      setError("No file provided");
      setResult(null);
      return;
    }

    if (!file.name.endsWith(".txt")) {
      setError("File must be .txt");
      setResult(null);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      workerRef.current.postMessage(event.target.result);
    };

    reader.readAsText(file);
  };

  return (
    <div>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        style={{
          border: "2px dashed #94a3b8",
          background: "#f8fafc",
          borderRadius: "14px",
          padding: "60px",
          textAlign: "center",
          marginTop: "80px",
          marginBottom: "20px",
          color: "#475569",
          fontWeight: 500,
          boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
        }}
      >
        Drag & Drop TXT file here
      </div>

      {error && (
        <p style={{ color: "#dc2626", fontWeight: 500, marginBottom: "12px" }}>
          {error}
        </p>
      )}

      {result && (
        <div
          style={{
            margin: "0 auto",
            maxWidth: "480px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "16px 20px",
            textAlign: "left",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "10px", color: "#0f172a" }}>
            Total unique words: {result.uniqueCount}
          </p>

          <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#1e293b" }}>
            Top 3 words:
          </h3>

          {result.top3.map((item, index) => (
            <p key={index} style={{ marginBottom: "6px", color: "#334155" }}>
              {item.word} : {item.count}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileDrop;
