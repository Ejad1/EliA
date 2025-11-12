# EliA — Interface Chat

This folder contains a minimal React (Vite) application implementing the EliA chat UI.

Quick start (Windows PowerShell):

```powershell
cd interface
npm install
npm run dev
```

What's included:
- Auth page (register/login). Currently uses local fake endpoints; replace with your AWS-backed API endpoints.
- Main chat UI with a sidebar (user info + conversation history) and a chat pane.
- Session handling: token stored in localStorage with expiry (1 hour). When token expires the user is logged out.
- Recorder button for audio capture (uses MediaRecorder); audio blob will be handed to a placeholder handler.

Next steps to wire to real backend:
- Replace `fakeServerRegister` / `fakeServerLogin` in `src/pages/AuthPage.jsx` with actual API calls to your AWS backend.
- Implement an `/api/chat` endpoint that receives user messages (and audio uploads) and returns assistant replies. Use the auth token header for authentication.
# Bibliquest Chat Interface

Minimal React (Vite) skeleton for the Bibliquest chatbot UI.

Quick start (from repository root on Windows PowerShell):

```powershell
cd interface
npm install
npm run dev
```

Then open the dev server URL printed by Vite (usually http://localhost:5173).

Next steps (after backend is ready):
- Implement `/api/chat` endpoint in the backend that accepts JSON { query: string } and returns a reply and optionally source passages.
- Replace the simulated response in `src/components/Chat.jsx` with a `fetch('/api/chat', { method: 'POST', body: JSON.stringify({query}) })` call.
- Add authentication or CORS if serving backend separately.
