import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";

const DashboardPage = () => {
  const { user, logout } = useAuth();

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

      {/* Main content */}
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 mt-1">Manage and analyze your resumes</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: "Resumes Uploaded", value: "0" },
            { label: "Avg ATS Score", value: "—" },
            { label: "Skills Matched", value: "—" },
          ].map(({ label, value }) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-primary-600">{value}</p>
            </div>
          ))}
        </div>

        {/* Empty state */}
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-500 mb-6">
            Upload your first resume to get started
          </p>
          <Button className="mx-auto">Upload Resume</Button>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
