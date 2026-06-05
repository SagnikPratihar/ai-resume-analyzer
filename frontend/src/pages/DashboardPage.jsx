import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import resumeService from "../services/resume.service.js";
import ResumeUpload from "../components/resume/ResumeUpload.jsx";
import Button from "../components/ui/Button.jsx";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const { data } = await resumeService.getAll();
      setResumes(data.resumes);
    } catch (err) {
      console.error("Failed to load resumes:", err);
    }
  };

  const handleUploadSuccess = (resume) => {
    setResumes((prev) => [resume, ...prev]);
    setShowUpload(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this resume?")) return;
    try {
      await resumeService.delete(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold text-primary-600">
            AI Resume Analyzer
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome, <span className="font-medium">{user?.name}</span>
            </span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
            <p className="text-gray-500 mt-1">
              Manage and analyze your resumes
            </p>
          </div>
          <Button onClick={() => setShowUpload(!showUpload)}>
            {showUpload ? "Cancel" : "+ Upload Resume"}
          </Button>
        </div>

        {/* Upload area */}
        {showUpload && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold mb-4">Upload New Resume</h3>
            <ResumeUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Resumes Uploaded", value: resumes.length },
            { label: "Avg ATS Score", value: "—" },
            { label: "Skills Matched", value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-primary-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Resume list */}
        {resumes.length === 0 ? (
          <div className="card text-center py-16">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No resumes yet
            </h3>
            <p className="text-gray-500 mb-6">
              Upload your first resume to get started
            </p>
            <Button className="mx-auto" onClick={() => setShowUpload(true)}>
              Upload Resume
            </Button>
          </div>
        ) : (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Resumes</h3>
            <div className="divide-y divide-gray-100">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  className="flex items-center justify-between py-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {resume.file_type === "pdf" ? "📕" : "📘"}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {resume.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {resume.file_type.toUpperCase()} •{" "}
                        {(resume.file_size / 1024).toFixed(1)} KB •{" "}
                        {resume.is_parsed ? "✅ Parsed" : "⏳ Parsing..."}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(resume.id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
