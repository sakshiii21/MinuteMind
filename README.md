# MinuteMind

MinuteMind is a React application for turning a meeting transcript into a summary, downloading notes as a PDF, and emailing the notes. The frontend uses a separately maintained Express backend for summarization and email delivery.

**Live app:** [minute-mind-liard.vercel.app](https://minute-mind-liard.vercel.app/)

**Frontend:** [github.com/sakshiii21/MinuteMind](https://github.com/sakshiii21/MinuteMind)

**Backend:** [github.com/sakshiii21/MinuteMind-backend](https://github.com/sakshiii21/MinuteMind-backend)

## Features

- Paste a transcript and request a summary from the backend.
- Download the generated notes as a PDF.
- Send notes to an email address through the backend.
- React single-page UI built with Vite.

## Stack

React · Vite · JavaScript · Express · Groq SDK · Google OAuth · Nodemailer · jsPDF

## Run the frontend

Requires Node.js and npm.

```bash
git clone https://github.com/sakshiii21/MinuteMind.git
cd MinuteMind
npm ci
```

Set the backend URL in a root `.env.local` file:

```dotenv
VITE_BACKEND_URL=http://localhost:5000
```

Then start the frontend:

```bash
npm run dev
```

Vite prints the local URL. The backend must be running separately for summarization and email delivery.

## Backend

Clone and configure [MinuteMind-backend](https://github.com/sakshiii21/MinuteMind-backend) separately. See its README for the required environment variables and startup command. The frontend's `server` entry is a Git submodule pointer; the repository currently lacks a `.gitmodules` file, so a fresh clone may not be able to initialize that entry. The separate backend URL above remains the documented source of backend code.

## Scripts

- `npm run dev` — start Vite.
- `npm run build` — create a production frontend build.
- `npm run lint` — run ESLint.
- `npm run preview` — preview the built frontend locally.

## Configuration

`VITE_BACKEND_URL` is exposed to browser code by Vite. It is a server URL, not a secret. Never put Groq or Google credentials in the frontend environment; configure those only on the backend.
