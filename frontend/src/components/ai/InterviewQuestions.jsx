import { useState } from "react";
import aiService from "../../services/ai.service.js";
import Button from "../ui/Button.jsx";

const QuestionCard = ({ question, why_asked, tip, context }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 bg-white hover:bg-gray-50
                   flex items-center justify-between gap-2"
      >
        <span className="font-medium text-gray-900 text-sm">{question}</span>
        <span className="text-gray-400 shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 bg-gray-50 space-y-2">
          {why_asked && (
            <p className="text-xs text-blue-700">
              <span className="font-semibold">Why asked:</span> {why_asked}
            </p>
          )}
          {tip && (
            <p className="text-xs text-green-700">
              <span className="font-semibold">💡 Tip:</span> {tip}
            </p>
          )}
          {context && (
            <p className="text-xs text-gray-600">
              <span className="font-semibold">Context:</span> {context}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const InterviewQuestions = ({ resume }) => {
  const [questions, setQuestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await aiService.generateInterviewQuestions(
        resume.id,
        jobTitle,
      );
      setQuestions(data.questions);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-1">
          🎯 Interview Question Generator
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Claude analyzes your resume and predicts likely interview questions
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Target job title (optional)"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="input-field flex-1"
          />
          <Button onClick={handleGenerate} loading={loading}>
            Generate Questions
          </Button>
        </div>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Results */}
      {questions && (
        <div className="space-y-6">
          {/* Technical */}
          {questions.technical_questions?.length > 0 && (
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">
                💻 Technical Questions ({questions.technical_questions.length})
              </h4>
              <div className="space-y-2">
                {questions.technical_questions.map((q, i) => (
                  <QuestionCard key={i} {...q} />
                ))}
              </div>
            </div>
          )}

          {/* Behavioral */}
          {questions.behavioral_questions?.length > 0 && (
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">
                🤝 Behavioral Questions ({questions.behavioral_questions.length}
                )
              </h4>
              <div className="space-y-2">
                {questions.behavioral_questions.map((q, i) => (
                  <QuestionCard key={i} {...q} />
                ))}
              </div>
            </div>
          )}

          {/* Resume specific */}
          {questions.resume_specific_questions?.length > 0 && (
            <div className="card">
              <h4 className="font-semibold text-gray-900 mb-3">
                📄 Resume-Specific Questions (
                {questions.resume_specific_questions.length})
              </h4>
              <div className="space-y-2">
                {questions.resume_specific_questions.map((q, i) => (
                  <QuestionCard key={i} {...q} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InterviewQuestions;
