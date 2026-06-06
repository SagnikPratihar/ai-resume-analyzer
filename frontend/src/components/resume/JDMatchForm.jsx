import { useState } from "react";
import jdService from "../../services/jd.service.js";
import Button from "../ui/Button.jsx";
import Input from "../ui/Input.jsx";
import Alert from "../ui/Alert.jsx";

const JDMatchForm = ({ resume, onMatchComplete }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    company: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.description.length < 50) {
      return setError("Job description must be at least 50 characters");
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await jdService.matchWithResume(resume.id, form);
      onMatchComplete?.(data.analysis);
    } catch (err) {
      setError(err.response?.data?.message || "Matching failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        Match with Job Description
      </h3>
      <p className="text-sm text-gray-500 mb-6">
        Paste a job description to see how well{" "}
        <span className="font-medium">{resume.title}</span> matches
      </p>

      <Alert type="error" message={error} />

      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <Input
          id="title"
          name="title"
          label="Job Title"
          placeholder="e.g. Senior Frontend Developer"
          value={form.title}
          onChange={handleChange}
          required
        />

        <Input
          id="company"
          name="company"
          label="Company (optional)"
          placeholder="e.g. Google"
          value={form.company}
          onChange={handleChange}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Description
          </label>
          <textarea
            name="description"
            rows={8}
            value={form.description}
            onChange={handleChange}
            placeholder="Paste the full job description here..."
            className="input-field resize-none"
            required
          />
          <p className="text-xs text-gray-400 mt-1">
            {form.description.length} characters
            {form.description.length < 50 && " (min 50)"}
          </p>
        </div>

        <Button type="submit" loading={loading} className="w-full py-2.5">
          {loading ? "Analyzing..." : "🔍 Match Resume to JD"}
        </Button>
      </form>
    </div>
  );
};

export default JDMatchForm;
