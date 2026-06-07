import { useState } from "react";
import aiService from "../../services/ai.service.js";
import Button from "../ui/Button.jsx";

const AIFeedback = ({ resume }) => {
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await aiService.getResumeFeedback(resume.id, jobTitle);
      setFeedback(data.feedback);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate feedback");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">
          🤖 AI Resume Feedback
        </h3>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Target job title (optional) e.g. Frontend Developer"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="input-field flex-1"
          />
          <Button onClick={handleGenerate} loading={loading}>
            Generate Feedback
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Results */}
      {feedback && (
        <div className="space-y-4">
          {/* Overall score + summary */}
          <div className="card">
            <div className="flex items-center gap-4 mb-3">
              <div
                className={`text-4xl font-bold ${
                  feedback.overall_score >= 70
                    ? "text-green-600"
                    : feedback.overall_score >= 50
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {feedback.overall_score}/100
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Overall Assessment
                </p>
                <p className="text-sm text-gray-600">{feedback.summary}</p>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="card">
            <h4 className="font-semibold text-green-700 mb-3">✅ Strengths</h4>
            <ul className="space-y-2">
              {feedback.strengths?.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-500 mt-0.5">•</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Improvements */}
          <div className="card">
            <h4 className="font-semibold text-red-700 mb-3">
              🔧 Areas to Improve
            </h4>
            <div className="space-y-4">
              {feedback.improvements?.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-lg p-4 bg-gray-50"
                >
                  <p className="font-medium text-gray-900 mb-1">{item.area}</p>
                  <p className="text-sm text-red-600 mb-2">❌ {item.issue}</p>
                  <p className="text-sm text-green-700">✅ {item.suggestion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick wins */}
          <div className="card">
            <h4 className="font-semibold text-blue-700 mb-3">⚡ Quick Wins</h4>
            <ul className="space-y-2">
              {feedback.quick_wins?.map((w, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm text-gray-700 bg-blue-50
                             border border-blue-100 rounded-lg p-3"
                >
                  <span className="text-blue-500">→</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFeedback;
