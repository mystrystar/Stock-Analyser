# Stock Analyser (React + n8n)

This is a minimal React frontend for your stock analysis workflow powered by n8n.

Users enter their **email** and a **stock or company name**. The app sends this data to your **n8n webhook**, which:

- runs your stock analysis logic, and
- sends an email with the results back to the user,
- while also returning a JSON response that the UI shows immediately.

## Development

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the webhook URL

In `src/App.tsx`, replace the placeholder:

```ts
const WEBHOOK_URL = "https://your-n8n-host/webhook/stock-analyser";
```

with your actual n8n webhook URL.

Expected request body:

```json
{
  "email": "user@example.com",
  "query": "Apple"
}
```

You can adjust this to match your own n8n flow if needed.

### 3. Run the dev server

```bash
npm run dev
```

Then open the printed URL in your browser (by default `http://localhost:5173`).

## n8n Flow (high level)

Your n8n webhook should:

1. Receive `{ "email": string, "query": string }`.
2. Use your existing logic to:
   - resolve the query to a stock symbol (if needed),
   - fetch stock data and compute indicators / rating.
3. Send an email to `email` with the analysis.
4. Return a JSON response to the webhook caller with the analysis fields used in `App.tsx`.

# Stock-Analyser
The stock analyser is an automated n8n workflow using a Gemini AI Agent to provide a professional analysis for a stock ticker symbol entered in a chat. It generates a concise report covering technical analysis, fundamental highlights, a clear BUY/HOLD/SELL recommendation, key risks, and a rationale.
Workflow
<img width="1920" height="1080" alt="Screenshot (22)" src="https://github.com/user-attachments/assets/bac978a6-31aa-46e3-9f65-1117be6f7b6c" />
Gmail Output
<img width="1920" height="1080" alt="Screenshot (20)" src="https://github.com/user-attachments/assets/eb1b574d-5ca9-499b-94fa-7eba75be4774" />
