const DashboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Dashboard
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['Resumes Analyzed', 'Avg ATS Score', 'Skills Matched'].map((label) => (
            <div key={label} className="card">
              <p className="text-sm text-gray-500 mb-1">{label}</p>
              <p className="text-3xl font-bold text-primary-600">—</p>
            </div>
          ))}
        </div>
        <div className="card mt-6">
          <p className="text-gray-500 text-center py-12">
            Dashboard analytics.
          </p>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage