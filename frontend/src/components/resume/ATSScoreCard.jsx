const ScoreRing = ({ score }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="140" height="140" className="-rotate-90">
        {/* Background ring */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
        />
        {/* Score ring */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute text-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="block text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
};

const ScoreBar = ({ label, score }) => {
  const color =
    score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{score.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
};

const ATSScoreCard = ({ analysis }) => {
  if (!analysis) return null;

  const score = parseFloat(analysis.ats_score) || 0;
  const label = score >= 70 ? "Good" : score >= 50 ? "Average" : "Needs Work";
  const skills = analysis.matched_skills
    ? typeof analysis.matched_skills === "string"
      ? JSON.parse(analysis.matched_skills)
      : analysis.matched_skills
    : [];

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">ATS Score</h3>

      {/* Score ring */}
      <div className="flex flex-col items-center mb-6">
        <ScoreRing score={score} />
        <span
          className={`mt-2 text-sm font-medium px-3 py-1 rounded-full ${
            score >= 70
              ? "bg-green-100 text-green-700"
              : score >= 50
                ? "bg-yellow-100 text-yellow-700"
                : "bg-red-100 text-red-700"
          }`}
        >
          {label}
        </span>
      </div>

      {/* Score breakdown */}
      <div className="space-y-3 mb-6">
        <ScoreBar
          label="Keywords"
          score={parseFloat(analysis.keyword_score) || 0}
        />
        <ScoreBar
          label="Sections"
          score={parseFloat(analysis.section_score) || 0}
        />
        <ScoreBar
          label="Content"
          score={parseFloat(analysis.readability_score) || 0}
        />
        <ScoreBar
          label="Format"
          score={parseFloat(analysis.format_score) || 0}
        />
      </div>

      {/* Found keywords */}
      {skills.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">
            Detected Skills
          </p>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 15).map((skill) => (
              <span
                key={skill}
                className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full border border-primary-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ATSScoreCard;
