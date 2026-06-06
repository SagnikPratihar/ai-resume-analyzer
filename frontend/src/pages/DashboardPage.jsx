import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth.js";
import resumeService from "../services/resume.service.js";
import analysisService from "../services/analysis.service.js";
import ResumeUpload from "../components/resume/ResumeUpload.jsx";
import ATSScoreCard from "../components/resume/ATSScoreCard.jsx";
import Button from "../components/ui/Button.jsx";
import Alert from "../components/ui/Alert.jsx";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [analyzing, setAnalyzing] = useState(null);
  const [activeAnalysis, setActiveAnalysis] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const unparsed = resumes.filter((r) => !r.is_parsed);
    if (unparsed.length === 0) return;

    const interval = setInterval(async () => {
      try {
        const { data } = await resumeService.getAll();
        setResumes(data.resumes);

        if (data.resumes.every((r) => r.is_parsed)) {
          clearInterval(interval);
        }
      } catch (err) {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [resumes]);

  const loadData = async () => {
    try {
      const [resumeRes, analysisRes] = await Promise.all([
        resumeService.getAll(),
        analysisService.getAll(),
      ]);
      setResumes(resumeRes.data.resumes);
      setAnalyses(analysisRes.data.analyses);
    } catch (err) {
      console.error("Failed to load data:", err);
    }
  };

  const handleUploadSuccess = (resume) => {
    setResumes((prev) => [resume, ...prev]);
    setShowUpload(false);
  };

  const handleAnalyze = async (resumeId) => {
    setAnalyzing(resumeId);
    setError("");
    try {
      const { data } = await analysisService.analyzeResume(resumeId);
      setAnalyses((prev) => [data.analysis, ...prev]);
      setActiveAnalysis(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(null);
    }
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

  const getLatestAnalysis = (resumeId) =>
    analyses.find((a) => a.resume_id === resumeId);

  const avgScore =
    analyses.length > 0
      ? (
          analyses.reduce((sum, a) => sum + parseFloat(a.ats_score || 0), 0) /
          analyses.length
        ).toFixed(0)
      : "—";

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

        {/* Error */}
        {error && <Alert type="error" message={error} />}

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
            { label: "Avg ATS Score", value: avgScore },
            { label: "Analyses Done", value: analyses.length },
          ].map(({ label, value }) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-primary-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Main content — resumes + score card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume list */}
          <div className="lg:col-span-2">
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
                  {resumes.map((resume) => {
                    const analysis = getLatestAnalysis(resume.id);
                    return (
                      <div key={resume.id} className="py-4">
                        <div className="flex items-center justify-between">
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
                                {resume.is_parsed
                                  ? "✅ Parsed"
                                  : "⏳ Parsing..."}
                              </p>
                            </div>
                          </div>

                          {/* Score badge */}
                          {analysis && (
                            <span
                              className={`text-sm font-bold px-3 py-1 rounded-full ${
                                parseFloat(analysis.ats_score) >= 70
                                  ? "bg-green-100 text-green-700"
                                  : parseFloat(analysis.ats_score) >= 50
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              ATS: {parseFloat(analysis.ats_score).toFixed(0)}
                            </span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-2 mt-3">
                          {resume.is_parsed && (
                            <Button
                              onClick={() => handleAnalyze(resume.id)}
                              loading={analyzing === resume.id}
                              className="text-sm py-1.5"
                            >
                              {analysis ? "Re-analyze" : "Analyze ATS Score"}
                            </Button>
                          )}
                          {analysis && (
                            <Button
                              variant="secondary"
                              onClick={() => setActiveAnalysis(analysis)}
                              className="text-sm py-1.5"
                            >
                              View Score
                            </Button>
                          )}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link to={`/analysis/${resume.id}`}>
                            <Button className="text-sm py-1.5">
                              Open Analysis
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(resume.id)}
                            className="text-sm py-1.5"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ATS Score Card */}
          <div className="lg:col-span-1">
            {activeAnalysis ? (
              <ATSScoreCard analysis={activeAnalysis} />
            ) : (
              <div className="card text-center py-12">
                <div className="text-4xl mb-3">📊</div>
                <p className="text-gray-500 text-sm">
                  Click "Analyze ATS Score" on a resume to see results here
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
