import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Upload, Users, BookOpen, AlertCircle, CheckCircle, Download, Eye, RefreshCw } from 'lucide-react';

interface Match {
  match_id: string;
  source_id: string;
  source_title: string;
  source_type: string;
  source_url?: string;
  author?: string;
  similarity_percentage: number;
  submitted_text: string;
  matched_text: string;
  page_number: number;
  is_excluded: boolean;
  exclusion_reason?: string;
}

interface Report {
  id: number;
  submission_id: number;
  overall_similarity: number;
  repo_similarity: number;
  web_similarity: number;
  open_access_similarity: number;
  peer_similarity: number;
  matches: Match[];
  web_search_status: string;
}

export default function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [role, setRole] = useState<string>(localStorage.getItem('role') || 'student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isRegister, setIsRegister] = useState(false);

  // App State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'submissions' | 'report'>('dashboard');
  const [courses, setCourses] = useState<any[]>([]);
  const [joinCode, setJoinCode] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Filters for Report
  const [filterExcludeQuotes, setFilterExcludeQuotes] = useState(false);
  const [filterExcludeBib, setFilterExcludeBib] = useState(false);
  const [activeSourceFilter, setActiveSourceFilter] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';
    const payload = isRegister ? { email, password, full_name: fullName, role } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Auth failed');

      if (!isRegister) {
        localStorage.setItem('token', data.access_token);
        setToken(data.access_token);
        fetchMe(data.access_token);
      } else {
        alert('Registration successful! Please log in.');
        setIsRegister(false);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const fetchMe = async (authToken: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const user = await res.json();
      if (res.ok) {
        setRole(user.role);
        localStorage.setItem('role', user.role);
        fetchCourses(authToken);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchCourses = async (authToken: string) => {
    try {
      const res = await fetch('/api/courses/', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      const data = await res.json();
      if (res.ok) setCourses(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (token) fetchMe(token);
  }, [token]);

  const handleJoinCourse = async () => {
    try {
      const res = await fetch('/api/courses/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ join_code: joinCode })
      });
      if (res.ok) {
        alert('Joined course successfully!');
        setJoinCode('');
        fetchCourses(token!);
      }
    } catch (e) {
      alert('Failed to join course');
    }
  };

  const handleFileUpload = async (assignmentId: number, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`/api/submissions/assignment/${assignmentId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        alert('File uploaded successfully! Analysis started in background.');
        fetchSubmissions(assignmentId);
      } else {
        const err = await res.json();
        alert(err.detail || 'Upload failed');
      }
    } catch (e) {
      alert('File upload failed');
    }
  };

  const fetchSubmissions = async (assignmentId: number) => {
    try {
      const res = await fetch(`/api/submissions/assignment/${assignmentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) setSubmissions(data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchReport = async (submissionId: number) => {
    try {
      const res = await fetch(`/api/reports/${submissionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedReport(data);
        setActiveTab('report');
      } else {
        alert(data.detail || 'Report not available');
      }
    } catch (e) {
      alert('Failed to fetch similarity report');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <ShieldCheck className="w-10 h-10 text-indigo-600" />
            <h1 className="text-2xl font-bold text-slate-800">VeriDraft</h1>
          </div>
          <h2 className="text-lg font-semibold text-center text-slate-600 mb-6">
            {isRegister ? 'Create an Account' : 'Sign In to Portal'}
          </h2>

          <form onSubmit={handleAuth} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>
            {isRegister && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer / Instructor</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg shadow transition"
            >
              {isRegister ? 'Register' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-indigo-600 font-semibold hover:underline"
            >
              {isRegister ? 'Log in' : 'Register'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  // Calculate live filtered score
  const filteredMatches = selectedReport?.matches.filter((m) => {
    if (filterExcludeQuotes && m.exclusion_reason === 'Quoted text') return false;
    if (filterExcludeBib && m.exclusion_reason === 'Bibliography section') return false;
    if (activeSourceFilter && m.source_id !== activeSourceFilter) return false;
    return true;
  }) || [];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-indigo-400" />
          <span className="text-xl font-bold tracking-tight">VeriDraft</span>
          <span className="text-xs bg-indigo-800 text-indigo-200 px-2 py-0.5 rounded-full capitalize">
            {role} Portal
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              localStorage.clear();
              setToken(null);
            }}
            className="text-sm bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-6 gap-6">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-white rounded-xl shadow p-4 space-y-2">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition ${
              activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-5 h-5" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition ${
              activeTab === 'courses' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Users className="w-5 h-5" /> Courses
          </button>
          {selectedReport && (
            <button
              onClick={() => setActiveTab('report')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition ${
                activeTab === 'report' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-5 h-5" /> Similarity Report
            </button>
          )}
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-white rounded-xl shadow p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Welcome to VeriDraft</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                  <span className="text-xs font-semibold text-indigo-600 uppercase">Enrolled / Created Courses</span>
                  <p className="text-2xl font-bold text-indigo-900 mt-1">{courses.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl">
                  <span className="text-xs font-semibold text-emerald-600 uppercase">System Status</span>
                  <p className="text-2xl font-bold text-emerald-900 mt-1">Operational</p>
                </div>
                <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl">
                  <span className="text-xs font-semibold text-purple-600 uppercase">Analysis Engine</span>
                  <p className="text-2xl font-bold text-purple-900 mt-1">MinHash + LSH</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'courses' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-800">Your Courses</h2>
                {role === 'student' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Join Code"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none"
                    />
                    <button
                      onClick={handleJoinCourse}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-4 py-1.5 rounded-lg font-medium"
                    >
                      Join Course
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {courses.map((c) => (
                  <div key={c.id} className="border border-slate-200 rounded-xl p-4 hover:border-indigo-300 transition">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{c.code}</span>
                    <h3 className="font-bold text-lg text-slate-800 mt-2">{c.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">Join Code: <code className="bg-slate-100 px-1 py-0.5 rounded">{c.join_code}</code></p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'report' && selectedReport && (
            <div className="space-y-6">
              {/* Report Header */}
              <div className="border-b border-slate-200 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Similarity Report #{selectedReport.id}</h2>
                  <p className="text-xs text-slate-500">Document Analysis Certificate</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`/api/reports/${selectedReport.submission_id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-indigo-600 text-white text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-700"
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </a>
                  <a
                    href={`/api/reports/${selectedReport.submission_id}/csv`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 bg-slate-200 text-slate-800 text-sm px-3 py-1.5 rounded-lg font-medium hover:bg-slate-300"
                  >
                    <Download className="w-4 h-4" /> Export CSV
                  </a>
                </div>
              </div>

              {/* Prominent Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-900 text-xs">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                <p>
                  <b>Prominent Disclaimer:</b> Similarity score is a quantitative indicator intended for academic review. It does not constitute definitive proof of plagiarism and must be evaluated by a human instructor.
                </p>
              </div>

              {/* Score Breakdown Cards */}
              <div className="grid grid-cols-5 gap-3">
                <div className="bg-slate-900 text-white p-4 rounded-xl text-center">
                  <span className="text-xs text-slate-400 font-medium">Overall Similarity</span>
                  <p className="text-3xl font-extrabold mt-1 text-emerald-400">{selectedReport.overall_similarity}%</p>
                </div>
                <div className="bg-slate-50 border p-3 rounded-xl text-center">
                  <span className="text-xs text-slate-500">Repository</span>
                  <p className="text-lg font-bold text-slate-800">{selectedReport.repo_similarity}%</p>
                </div>
                <div className="bg-slate-50 border p-3 rounded-xl text-center">
                  <span className="text-xs text-slate-500">Internet / Web</span>
                  <p className="text-lg font-bold text-slate-800">{selectedReport.web_similarity}%</p>
                </div>
                <div className="bg-slate-50 border p-3 rounded-xl text-center">
                  <span className="text-xs text-slate-500">Publications</span>
                  <p className="text-lg font-bold text-slate-800">{selectedReport.open_access_similarity}%</p>
                </div>
                <div className="bg-slate-50 border p-3 rounded-xl text-center">
                  <span className="text-xs text-slate-500">Peer Submissions</span>
                  <p className="text-lg font-bold text-slate-800">{selectedReport.peer_similarity}%</p>
                </div>
              </div>

              {/* Interactive Filters */}
              <div className="flex gap-4 items-center bg-slate-50 p-3 rounded-xl border text-xs">
                <span className="font-bold text-slate-700">Toggles:</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterExcludeQuotes}
                    onChange={(e) => setFilterExcludeQuotes(e.target.checked)}
                  />
                  Exclude Quotes
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filterExcludeBib}
                    onChange={(e) => setFilterExcludeBib(e.target.checked)}
                  />
                  Exclude Bibliography
                </label>
                {activeSourceFilter && (
                  <button
                    onClick={() => setActiveSourceFilter(null)}
                    className="ml-auto bg-slate-200 hover:bg-slate-300 px-2 py-1 rounded text-slate-700 font-medium"
                  >
                    Clear Source Filter
                  </button>
                )}
              </div>

              {/* Matches List */}
              <div className="space-y-3">
                <h3 className="font-bold text-slate-800">Matched Passages ({filteredMatches.length})</h3>
                {filteredMatches.map((m) => (
                  <div key={m.match_id} className="border border-slate-200 rounded-xl p-4 space-y-2 hover:border-indigo-300 transition">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {m.source_title}
                      </span>
                      <span className="font-bold text-amber-600">{m.similarity_percentage}% Match</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-xs mt-2">
                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <span className="font-semibold text-slate-500 block mb-1">Submitted Passage:</span>
                        <p className="text-slate-800">{m.submitted_text}</p>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                        <span className="font-semibold text-amber-800 block mb-1">Matched Source Passage:</span>
                        <p className="text-amber-950">{m.matched_text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
