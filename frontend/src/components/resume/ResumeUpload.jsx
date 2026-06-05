import { useState, useRef } from "react";
import resumeService from "../../services/resume.service.js";
import Button from "../ui/Button.jsx";
import Alert from "../ui/Alert.jsx";

const ResumeUpload = ({ onUploadSuccess }) => {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    setError("");
    setSuccess("");

    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) {
      return setError("Only PDF and DOCX files are allowed");
    }

    if (file.size > 5 * 1024 * 1024) {
      return setError("File size must be less than 5MB");
    }

    setUploading(true);
    try {
      const { data } = await resumeService.upload(file);
      setSuccess("Resume uploaded! Parsing in progress...");
      onUploadSuccess?.(data.resume);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="w-full">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-colors duration-200
          ${
            dragging
              ? "border-primary-500 bg-primary-50"
              : "border-gray-300 hover:border-primary-400 hover:bg-gray-50"
          }
        `}
      >
        <div className="text-5xl mb-4">📄</div>
        <p className="text-lg font-medium text-gray-700 mb-1">
          Drop your resume here
        </p>
        <p className="text-sm text-gray-500 mb-4">or click to browse files</p>
        <p className="text-xs text-gray-400">Supports PDF and DOCX • Max 5MB</p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          className="hidden"
          onChange={(e) => e.target.files[0] && handleFile(e.target.files[0])}
        />
      </div>

      {/* Status messages */}
      <div className="mt-4 space-y-2">
        {uploading && (
          <div className="flex items-center gap-2 text-sm text-primary-600">
            <div className="animate-spin h-4 w-4 border-2 border-primary-600 border-t-transparent rounded-full" />
            Uploading and parsing your resume...
          </div>
        )}
        <Alert type="error" message={error} />
        <Alert type="success" message={success} />
      </div>
    </div>
  );
};

export default ResumeUpload;
