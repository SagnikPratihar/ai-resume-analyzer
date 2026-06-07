import { useState } from "react";
import aiService from "../../services/ai.service.js";
import Button from "../ui/Button.jsx";

const BulletEnhancer = () => {
  const [bullets, setBullets] = useState([""]);
  const [enhanced, setEnhanced] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [jobTitle, setJobTitle] = useState("");

  const addBullet = () => {
    if (bullets.length < 10) setBullets((prev) => [...prev, ""]);
  };

  const updateBullet = (index, value) => {
    setBullets((prev) => prev.map((b, i) => (i === index ? value : b)));
  };

  const removeBullet = (index) => {
    if (bullets.length > 1) {
      setBullets((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleEnhance = async () => {
    const filled = bullets.filter((b) => b.trim());
    if (filled.length === 0) {
      return setError("Add at least one bullet point");
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await aiService.enhanceBullets(filled, jobTitle);
      setEnhanced(data.enhanced_bullets);
    } catch (err) {
      setError(err.response?.data?.message || "Enhancement failed");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-1">
          ✨ Bullet Point Enhancer
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Paste your weak bullet points and Gemini will rewrite them
        </p>

        <input
          type="text"
          placeholder="Target job title (optional)"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="input-field mb-4"
        />

        <div className="space-y-2 mb-4">
          {bullets.map((bullet, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={bullet}
                onChange={(e) => updateBullet(index, e.target.value)}
                placeholder={`Bullet ${index + 1} e.g. "worked on backend APIs"`}
                className="input-field flex-1"
              />
              {bullets.length > 1 && (
                <button
                  onClick={() => removeBullet(index)}
                  className="text-red-500 hover:text-red-700 px-2"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={addBullet}
            className="text-sm text-primary-600 hover:underline"
          >
            + Add another bullet
          </button>
          <Button onClick={handleEnhance} loading={loading} className="ml-auto">
            ✨ Enhance Bullets
          </Button>
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </div>

      {/* Results */}
      {enhanced && (
        <div className="card">
          <h4 className="font-semibold text-gray-900 mb-4">Enhanced Bullets</h4>
          <div className="space-y-4">
            {enhanced.map((item, i) => (
              <div
                key={i}
                className="border border-gray-100 rounded-lg p-4 bg-gray-50"
              >
                <p className="text-sm text-gray-500 line-through mb-2">
                  {item.original}
                </p>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-green-700 flex-1">
                    ✅ {item.enhanced}
                  </p>
                  <button
                    onClick={() => copyToClipboard(item.enhanced)}
                    className="text-xs text-primary-600 hover:underline shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 italic">
                  💡 {item.explanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BulletEnhancer;
