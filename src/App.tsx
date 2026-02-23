import React, { useState } from "react";

const API_PATH = "/api/stock";

type AnalysisResponse = {
  symbol: string;
  companyName: string;
  currentPrice: number;
  currency: string;
  changePercent: number;
  timeframe: string;
  trend: string;
  rating: string;
  summary: string;
  lastUpdated: string;
};

export const App: React.FC = () => {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const url = `${API_PATH}?email=${encodeURIComponent(
        email
      )}&query=${encodeURIComponent(query)}`;

      const res = await fetch(url, {
        method: "GET"
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

      const data: AnalysisResponse = await res.json();
      setResult(data);
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

        {result && (
          <div className="result">
            <h2>
              {result.companyName} ({result.symbol})
            </h2>
            <p>
              <strong>Price:</strong> {result.currentPrice} {result.currency} ({result.changePercent}%)
            </p>
            <p>
              <strong>Timeframe:</strong> {result.timeframe}
            </p>
            <p>
              <strong>Trend:</strong> {result.trend}
            </p>
            <p>
              <strong>Rating:</strong> {result.rating}
            </p>
            <p>
              <strong>Summary:</strong> {result.summary}
            </p>
            <p className="muted">
              Last updated: {new Date(result.lastUpdated).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

