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
          <div className="result">
            <p>
              <strong>Stock:</strong> {result.stock}
            </p>
            <p>
              <strong>Action:</strong> {result.action}
            </p>
            <p>
              <strong>Confidence:</strong> {result.confidence}
            </p>
            <p>
              <strong>Price target:</strong> {result.priceTarget}
            </p>
            <p>
              <strong>Stop loss:</strong> {result.stopLoss}
            </p>
            <p>
              <strong>Time horizon:</strong> {result.timeHorizon}
            </p>
            <p className="muted">
              The full analysis details have also been sent to your email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

