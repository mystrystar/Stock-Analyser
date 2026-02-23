import { useState, type FormEvent } from "react";

const API_PATH = "/api/stock";

type AnalysisResponse = {
  stock: string;
  action: string;
  confidence: string;
  priceTarget: string;
  stopLoss: string;
  timeHorizon: string;
};

export const App = () => {
  const [email, setEmail] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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

      if (
        !firstItem ||
        typeof firstItem.stock !== "string" ||
        typeof firstItem.action !== "string"
      ) {
        throw new Error("Unexpected response from server.");
      }

      setResult({
        stock: firstItem.stock,
        action: firstItem.action,
        confidence: firstItem.confidence,
        priceTarget: firstItem.priceTarget,
        stopLoss: firstItem.stopLoss,
        timeHorizon: firstItem.timeHorizon
      });
      setSuccess("Email sent successfully. Details will be sent via mail.");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <header className="card-header">
          <div className="card-title-group">
            <h1>Stock Analyser</h1>
            <p className="subtitle">
              Get a fast AI-backed view on any stock. Enter your email and a
              ticker or company name to receive a concise trading outlook.
            </p>
          </div>
          <span className="badge">AI-powered</span>
        </header>

        <form onSubmit={handleSubmit} className="form">
          <label className="field">
            <span>Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
            />
            <p className="helper">We&apos;ll send your full analysis here.</p>
          </label>

          <label className="field">
            <span>Stock / Company</span>
            <input
              type="text"
              required
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. AAPL, TSLA or Apple"
              disabled={loading}
            />
            <p className="helper">
              Use a ticker symbol or a full company name.
            </p>
          </label>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading && <span className="spinner" aria-hidden="true" />}
            <span>{loading ? "Analysing..." : "Analyse stock"}</span>
          </button>
        </form>

        {error && <p className="error">Error: {error}</p>}

        {success && <div className="toast fade-in">{success}</div>}

        {result && (
          <div className="result fade-in">
            <div className="result-header">
              <div>
                <span className="result-label">Recommendation</span>
                <p className="result-stock">{result.stock}</p>
              </div>
              <span className="pill">{result.action}</span>
            </div>

            <div className="result-grid">
              <div className="result-item">
                <span className="result-key">Confidence</span>
                <span className="result-value">{result.confidence}</span>
              </div>
              <div className="result-item">
                <span className="result-key">Price target</span>
                <span className="result-value">{result.priceTarget}</span>
              </div>
              <div className="result-item">
                <span className="result-key">Stop loss</span>
                <span className="result-value">{result.stopLoss}</span>
              </div>
              <div className="result-item">
                <span className="result-key">Time horizon</span>
                <span className="result-value">{result.timeHorizon}</span>
              </div>
            </div>

            <p className="muted">
              A detailed breakdown has also been sent to your email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

