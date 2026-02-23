import React, { useState } from "react";

const API_PATH = "/api/stock";

type AnalysisResponse = {
  html: string;
};

export const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
   const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
     setSuccess(null);

    try {
      const res = await fetch(API_PATH, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, query })
      });

      if (!res.ok) {
        let details = "";
        try {
          details = await res.text();
        } catch {
          // ignore
        }
        throw new Error(
          `Request failed with status ${res.status}${
            details ? ` – ${details}` : ""
          }`
        );
      }

      const data = await res.json();
      const firstItem = Array.isArray(data) ? data[0] : data;

      const html =
        firstItem?.html ??
        firstItem?.myField ??
        (typeof firstItem === "string" ? firstItem : undefined);

      if (typeof html !== "string") {
        throw new Error("Unexpected response from server (no html / myField).");
      }

      setResult({ html });
      setSuccess("Email sent successfully.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1>Stock Analyser</h1>
        <p className="subtitle">
          Enter your email and a stock or company name. We&apos;ll analyse it and email you the result.
        </p>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label className="field">
            <span>Stock / Company</span>
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. AAPL or Apple"
            />
          </label>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? "Analysing..." : "Analyse"}
          </button>
        </form>

        {error && <p className="error">Error: {error}</p>}

        {success && <div className="toast">{success}</div>}

        {result && (
          <div
            className="result"
            dangerouslySetInnerHTML={{ __html: result.html }}
          />
        )}
      </div>
    </div>
  );
};

