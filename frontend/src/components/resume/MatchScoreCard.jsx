const SkillTag = ({ skill, matched }) => (
  <span
    className={`px-2 py-1 text-xs rounded-full border font-medium ${
      matched
        ? "bg-green-50 text-green-700 border-green-200"
        : "bg-red-50 text-red-700 border-red-200"
    }`}
  >
    {matched ? "✅" : "❌"} {skill}
  </span>
);

const MatchScoreCard = ({ analysis }) => {
  if (!analysis) return null;

  const score = parseFloat(analysis.match_percentage) || 0;

  const matchedSkills = analysis.matched_skills
    ? typeof analysis.matched_skills === "string"
      ? JSON.parse(analysis.matched_skills)
      : analysis.matched_skills
    : [];

  const missingSkills = analysis.missing_skills
    ? typeof analysis.missing_skills === "string"
      ? JSON.parse(analysis.missing_skills)
      : analysis.missing_skills
    : [];

  const color =
    score >= 70
      ? "text-green-600"
      : score >= 50
        ? "text-yellow-600"
        : "text-red-600";

  const bgColor =
    score >= 70
      ? "bg-green-50 border-green-200"
      : score >= 50
        ? "bg-yellow-50 border-yellow-200"
        : "bg-red-50 border-red-200";

  return (
    <div className="card space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">JD Match Results</h3>

      {/* Match percentage */}
      <div className={`rounded-xl p-6 border text-center ${bgColor}`}>
        <p className="text-sm text-gray-600 mb-1">Overall Match</p>
        <p className={`text-6xl font-bold ${color}`}>{score.toFixed(0)}%</p>
        <p className="text-sm text-gray-500 mt-1">
          {score >= 70
            ? "🎉 Strong match — apply with confidence!"
            : score >= 50
              ? "Decent match — improve missing skills"
              : "Keep working — significant gaps found"}
        </p>
      </div>

      {/* Matched skills */}
      {matchedSkills.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Skills You Have ({matchedSkills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <SkillTag key={skill} skill={skill} matched={true} />
            ))}
          </div>
        </div>
      )}

      {/* Missing skills */}
      {missingSkills.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-3">
            Skills to Learn ({missingSkills.length})
          </p>
          <div className="flex flex-wrap gap-2">
            {missingSkills.map((skill) => (
              <SkillTag key={skill} skill={skill} matched={false} />
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {missingSkills.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">💡 Tip:</span> Focus on adding{" "}
            <span className="font-medium">
              {missingSkills.slice(0, 3).join(", ")}
            </span>{" "}
            to your resume to significantly improve your match score.
          </p>
        </div>
      )}
    </div>
  );
};

export default MatchScoreCard;
