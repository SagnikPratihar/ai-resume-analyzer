const HomePage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-bold text-primary-900 mb-4">
          AI Resume Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Optimize your resume with AI-powered ATS scoring, skill gap analysis,
          and personalized feedback.
        </p>
        <div className="flex gap-4 justify-center">
          <a href="/register" className="btn-primary text-lg px-8 py-3">
            Get Started
          </a>
          <a href="/login" className="btn-secondary text-lg px-8 py-3">
            Sign In
          </a>
        </div>
      </div>
    </div>
  )
}

export default HomePage