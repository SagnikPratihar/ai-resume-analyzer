import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import resumeService from "../services/resume.service.js";
import analysisService from "../services/analysis.service.js";
import ATSScoreCard from "../components/resume/ATSScoreCard.jsx";
import JDMatchForm from "../components/resume/JDMatchForm.jsx";
import MatchScoreCard from "../components/resume/MatchScoreCard.jsx";
import AIFeedback from "../components/ai/AIFeedback.jsx";
import BulletEnhancer from "../components/ai/BulletEnhancer.jsx";
import InterviewQuestions from "../components/ai/InterviewQuestions.jsx";
import Button from "../components/ui/Button.jsx";
import useAuth from "../hooks/useAuth.js";

const TABS = [
  { key: "ats", label: "📊 ATS Score" },
  { key: "match", label: "🔍 JD Matching" },
  { key: "feedback", label: "🤖 AI Feedback" },
  { key: "bullets", label: "✨ Bullet Enhancer" },
  { key: "interview", label: "🎯 Interview Prep" },
];

const AnalysisPage = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [resume, setResume] = useState(null);
  const [atsAnalysis, setAtsAnalysis] = useState(null);
  const [matchAnalysis, setMatchAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState("ats");
  const [error, setError] = useState("");

  useEffect(() => {
    loadResume();
  }, [id]);

  const loadResume = async () => {
    try {
      const { data } = await resumeService.getById(id);
      setResume(data.resume);
    } catch {
      setError("Failed to load resume");
    }
  };

  const handleATSAnalyze = async () => {
    setAnalyzing(true);
    setError("");
    try {
      const { data } = await analysisService.analyzeResume(id);
      setAtsAnalysis(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleMatchComplete = (analysis) => {
    setMatchAnalysis(analysis);
    setActiveTab("match");
  };

  if (!resume) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              ← Dashboard
            </Link>
            <span className="text-gray-300">|</span>
            <h1 className="text-lg font-bold text-primary-600">
              {resume.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.name}</span>
            <Button variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Resume Analysis</h2>
          <p className="text-gray-500 text-sm mt-1">
            {resume.file_type.toUpperCase()} •{" "}
            {(resume.file_size / 1024).toFixed(1)} KB •{" "}
            {resume.is_parsed ? "✅ Parsed" : "⏳ Parsing..."}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-4 p-3 bg-red-50 border border-red-200
                          rounded-lg text-red-700 text-sm"
          >
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap
                         transition-colors ${
                           activeTab === tab.key
                             ? "border-primary-600 text-primary-600"
                             : "border-transparent text-gray-500 hover:text-gray-700"
                         }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── ATS Score Tab ── */}
        {activeTab === "ats" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold text-gray-900 mb-2">
                ATS Score Analysis
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Check how well your resume performs against ATS systems
              </p>
              <Button
                onClick={handleATSAnalyze}
                loading={analyzing}
                disabled={!resume.is_parsed}
                className="w-full"
              >
                {atsAnalysis ? "Re-analyze ATS Score" : "Analyze ATS Score"}
              </Button>
              {!resume.is_parsed && (
                <p className="text-xs text-yellow-600 mt-2 text-center">
                  ⏳ Waiting for resume to finish parsing...
                </p>
              )}
            </div>
            <div>
              {atsAnalysis ? (
                <ATSScoreCard analysis={atsAnalysis} />
              ) : (
                <div className="card text-center py-12">
                  <div className="text-4xl mb-3">📊</div>
                  <p className="text-gray-500 text-sm">
                    Click "Analyze ATS Score" to see your score
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── JD Match Tab ── */}
        {activeTab === "match" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <JDMatchForm
              resume={resume}
              onMatchComplete={handleMatchComplete}
            />
            {matchAnalysis ? (
              <MatchScoreCard analysis={matchAnalysis} />
            ) : (
              <div className="card text-center py-12">
                <div className="text-4xl mb-3">🔍</div>
                <p className="text-gray-500 text-sm">
                  Paste a job description and click match to see results
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── AI Feedback Tab ── */}
        {activeTab === "feedback" && <AIFeedback resume={resume} />}

        {/* ── Bullet Enhancer Tab ── */}
        {activeTab === "bullets" && <BulletEnhancer />}

        {/* ── Interview Prep Tab ── */}
        {activeTab === "interview" && <InterviewQuestions resume={resume} />}
      </main>
    </div>
  );
};

export default AnalysisPage;
