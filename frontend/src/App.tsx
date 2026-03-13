import React, { useEffect, useMemo, useState } from "react";

type Job = {
  id: number;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  createdAt: string;
};

type Application = {
  id: number;
  jobId: number;
  jobTitle: string;
  name: string;
  email: string;
  resumeUrl: string;
  createdAt: string;
};

const API_BASE_URL = "http://localhost:4000";

export const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdminView, setIsAdminView] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location: "",
    salaryRange: ""
  });

  const [applicationForm, setApplicationForm] = useState({
    name: "",
    email: "",
    resumeUrl: ""
  });

  const selectedJob = useMemo(
    () => jobs.find((job) => job.id === selectedJobId) ?? null,
    [jobs, selectedJobId]
  );

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [jobsRes, applicationsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/jobs`),
        fetch(`${API_BASE_URL}/applications`)
      ]);

      if (!jobsRes.ok || !applicationsRes.ok) {
        throw new Error("Failed to load data from server");
      }

      const jobsData = (await jobsRes.json()) as Job[];
      const applicationsData = (await applicationsRes.json()) as Application[];

      setJobs(jobsData);
      setApplications(applicationsData);

      if (jobsData.length > 0 && selectedJobId === null) {
        setSelectedJobId(jobsData[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) {
      setError("Please fill in the job title and description.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobForm)
      });

      if (!res.ok) {
        throw new Error("Failed to create job");
      }

      setJobForm({
        title: "",
        description: "",
        location: "",
        salaryRange: ""
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      setError("Please select a job before applying.");
      return;
    }
    if (!applicationForm.name || !applicationForm.email || !applicationForm.resumeUrl) {
      setError("Please fill in all application fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/jobs/${selectedJobId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationForm)
      });

      if (!res.ok) {
        throw new Error("Failed to submit application");
      }

      setApplicationForm({
        name: "",
        email: "",
        resumeUrl: ""
      });
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-tight text-slate-400">
              Unizoy
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              Careers
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Roles and opportunities at Unizoy.
            </p>
          </div>
          <div className="inline-flex rounded-lg bg-slate-800 p-1">
            <button
              type="button"
              onClick={() => setIsAdminView(false)}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                !isAdminView
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Candidate
            </button>
            <button
              type="button"
              onClick={() => setIsAdminView(true)}
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                isAdminView
                  ? "bg-slate-100 text-slate-900 shadow-sm"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-4">
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm text-red-100">
            {error}
          </div>
        )}

        {loading && (
          <p className="text-sm text-slate-400">Loading, please wait…</p>
        )}

        <div className="grid main-grid-two-column column-gap-6 items-start">
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-medium">
                {isAdminView ? "All job postings" : "Open positions"}
              </h2>
              <span className="text-xs text-slate-400">
                {jobs.length} job{jobs.length === 1 ? "" : "s"}
              </span>
            </div>

            <div className="space-y-3">
              {jobs.length === 0 && (
                <p className="text-sm text-slate-400">
                  No jobs posted yet. {isAdminView ? "Create the first role below." : "Please check back soon."}
                </p>
              )}

              {jobs.map((job) => (
                <article
                  key={job.id}
                  className={`group rounded-xl border bg-slate-900/60 px-4 py-4 transition hover:border-sky-500/70 hover:bg-slate-900 shadow-sm ${
                    selectedJobId === job.id ? "border-sky-500/90" : "border-slate-800"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedJobId(job.id)}
                    className="w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-slate-50 group-hover:text-sky-100">
                        {job.title}
                      </h3>
                      <span className="text-[11px] text-slate-400">
                        {new Date(job.createdAt).toLocaleDateString(undefined, {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                    {job.location || job.salaryRange ? (
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                        {job.location && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                            {job.location}
                          </span>
                        )}
                        {job.salaryRange && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-800 px-2 py-0.5">
                            💰 {job.salaryRange}
                          </span>
                        )}
                      </div>
                    ) : null}
                    {job.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                        {job.description}
                      </p>
                    )}
                  </button>
                </article>
              ))}
            </div>

            {selectedJob && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
                <h2 className="text-sm font-semibold text-slate-200">
                  Selected job details
                </h2>
                <p className="mt-1 text-sm text-slate-300">
                  <span className="font-medium">{selectedJob.title}</span>{" "}
                  {selectedJob.location && `· ${selectedJob.location}`}{" "}
                  {selectedJob.salaryRange && `· ${selectedJob.salaryRange}`}
                </p>
                <p className="mt-2 text-sm text-slate-300 whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>
            )}
          </section>

          <section className="space-y-5">
            {isAdminView ? (
              <>
                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                  <h2 className="text-lg font-medium">Post a new job</h2>
                  <form onSubmit={handleCreateJob} className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                        Job title
                      </label>
                      <input
                        className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        placeholder="Senior Software Engineer"
                        value={jobForm.title}
                        onChange={(e) =>
                          setJobForm((prev) => ({ ...prev, title: e.target.value }))
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                        Description
                      </label>
                      <textarea
                        className="min-h-[90px] w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        placeholder="Tell candidates about the role, responsibilities, and what makes Unizoy special."
                        value={jobForm.description}
                        onChange={(e) =>
                          setJobForm((prev) => ({
                            ...prev,
                            description: e.target.value
                          }))
                        }
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                          Location
                        </label>
                        <input
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          placeholder="Mumbai · Remote"
                          value={jobForm.location}
                          onChange={(e) =>
                            setJobForm((prev) => ({
                              ...prev,
                              location: e.target.value
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                          Salary range
                        </label>
                        <input
                          className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                          placeholder="₹20L – ₹35L"
                          value={jobForm.salaryRange}
                          onChange={(e) =>
                            setJobForm((prev) => ({
                              ...prev,
                              salaryRange: e.target.value
                            }))
                          }
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-3 py-2 text-sm font-medium text-slate-950 shadow-sm hover:bg-sky-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={loading}
                    >
                      {loading ? "Saving…" : "Post job"}
                    </button>
                  </form>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3 max-h-[320px] overflow-auto">
                  <h2 className="text-lg font-medium">Recent applications</h2>
                  {applications.length === 0 ? (
                    <p className="text-sm text-slate-400">
                      No one has applied yet. Once candidates submit the form, they will show up here.
                    </p>
                  ) : (
                    <ul className="space-y-3 text-sm">
                      {applications.map((app) => (
                        <li
                          key={app.id}
                          className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <p className="font-medium text-slate-50">
                                {app.name}
                                <span className="ml-1 text-xs text-slate-400">
                                  ({app.email})
                                </span>
                              </p>
                              <p className="text-xs text-slate-400">
                                Applied for <span className="font-medium">{app.jobTitle}</span>
                              </p>
                            </div>
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-medium text-sky-300 hover:text-sky-200"
                            >
                              View resume
                            </a>
                          </div>
                          <p className="mt-1 text-xs text-slate-500">
                            {new Date(app.createdAt).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 space-y-3">
                <h2 className="text-lg font-medium">Apply for a role</h2>
                <p className="text-sm text-slate-300">
                  Choose a role on the left, then share your details and a link to your resume (Google Drive, LinkedIn, portfolio, etc.).
                </p>

                <form onSubmit={handleApply} className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                      Selected job
                    </label>
                    <select
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      value={selectedJobId ?? ""}
                      onChange={(e) =>
                        setSelectedJobId(e.target.value ? Number(e.target.value) : null)
                      }
                    >
                      <option value="">Choose a job</option>
                      {jobs.map((job) => (
                        <option key={job.id} value={job.id}>
                          {job.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                      Full name
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      placeholder="Your name"
                      value={applicationForm.name}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({ ...prev, name: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      placeholder="you@example.com"
                      value={applicationForm.email}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({ ...prev, email: e.target.value }))
                      }
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium uppercase tracking-wide text-slate-300">
                      Resume / portfolio link
                    </label>
                    <input
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-50 outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                      placeholder="https://..."
                      value={applicationForm.resumeUrl}
                      onChange={(e) =>
                        setApplicationForm((prev) => ({
                          ...prev,
                          resumeUrl: e.target.value
                        }))
                      }
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-950 shadow-sm hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                  >
                    {loading ? "Submitting…" : "Submit application"}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </main>

      <footer className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        Built for the Unizoy job board assignment.
      </footer>
    </div>
  );
};

