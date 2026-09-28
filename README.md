# 🛡️ Veridex

![React](https://img.shields.io/badge/React-18%20%7C%20TypeScript-0F172A)
![Vite](https://img.shields.io/badge/Vite-5-646CFF)
![Node](https://img.shields.io/badge/Node-Express-1A2029)
![Gemini](https://img.shields.io/badge/Gemini-flash--latest-2563EB)
![Privacy](https://img.shields.io/badge/Privacy-No%20Storage-059669)

> **Clear verification for everyday decisions.** Paste a message, link, article or document — get a structured verdict with confidence, explanation and signals. Optional account for unlimited checks. No data stored.

Live examination-desk hero owns the viewport. Editorial light with `--paper`/`--ink`/`--lamp` tokens, `Inter` + `Newsreader` (serif body) + `Archivo` (instrument readouts), restrained flat surfaces. All CTAs are quiet underline links tinted with the lamp accent.

---

## ✨ Features — Detailed

### Core Verification
| Feature | What it does |
|---|---|
| **Multi-type analysis** `src/lib/api.ts:17` `src/components/InputForm.tsx:9` | `message` (phishing/urgency/credential requests) · `link` (HTTPS, IP host, homograph, subdomains, TLD, shortener, port, phishy keywords) `server/index.js:29` · `news` (claim framing, source credibility) · `document` · `image` (AI-generated detection via Gemini) |
| **Structured result** `src/components/ResultCard.tsx:1` | `verdict` `SAFE/SUSPICIOUS/SCAM/TRUSTWORTHY/QUESTIONABLE/LIKELY_FAKE` + `confidence 0-100` + `explanation` + `signals[0..12]` + `rawText` |
| **Confidence calibration** `src/components/ResultCard.tsx:53` | `Very High (≥80) / High (≥60) / Moderate (≥40) / Low (≥20) / Very Low` — mono `87/100` large type, bar `width:pct%` |
| **Verdict feedback** `src/components/ResultCard.tsx:33` | Copy (`Copy` `lucide`) + Share (`Share2`, Web Share API fallback to clipboard) |
| **Image analysis** `src/lib/api.ts:22` | Routes to Gemini multimodal for AI-generated content detection with contextual fallback messages |

### Authentication & Credits
| Feature | Detail |
|---|---|
| **Guest mode** `src/context/AuthContext.tsx:1` | 10 free credits without account. Local storage tracking. |
| **Account mode** `src/context/AuthContext.tsx:1` | Unlimited checks after registration. JWT authentication with refresh tokens. |
| **Credit tracking** `src/components/Header.tsx:1` | Visual credit badge in header with progress bar. Toast notifications on credit usage. |
| **Google OAuth** `src/components/ui/GoogleSignInButton.tsx:1` | Optional Google sign-in integration. |

### Document & History
| Feature | Detail |
|---|---|
| **Document upload** `src/components/InputForm.tsx:32` `34` | `.txt` via `File.text()` inline, `.pdf/.docx` prompt to copy text (placeholder for `pdf-parse`/`mammoth`). Shown as `Attach file` pill, `0 / 10,000` counter `var(--font-mono)`. |
| **Result history** `src/pages/AnalyzerPage.tsx:7` `src/components/InputForm.tsx:24` (planned) | Persist last 20 results in `localStorage veridex-history` — private, no server storage. Click to restore. |
| **Video hero** `src/pages/HomePage.tsx:32` `public/Vid/truth.mp4` | `Vid/truth.mp4` → `public/Vid/truth.mp4` `video` `autoPlay loop muted playsInline controls={false} disablePictureInPicture` `720×460` `16:9` wide, not tall. Editorial slip replaced — top `3px #0F172A` rule, `Ref 4F29 • EXAMPLE`. |

### Browser Extension
| Feature | Detail |
|---|---|
| **Chrome extension** `browser-extension/` | TypeScript-based extension for in-browser verification. |
| **Content script** `browser-extension/src/content/ui-injector.ts` | Injects verification UI into web pages. |
| **Background worker** `browser-extension/src/background/service-worker.ts` | Handles API calls and storage. |
| **Options page** `browser-extension/src/options/options.ts` | Extension settings and configuration. |

### Intelligence & Safety
| Feature | Detail |
|---|---|
| **Heuristic URL scan** `server/index.js:29` | 8 signals + riskScore (10-20 each). `SUSPICIOUS` bias if `riskScore≥20`. |
| **Reputation (opt-in)** `server/index.js:110` `ENABLE_REPUTATION_CHECKS=1` | `phish.sinking.yachts/v2` lookup → `Listed in phishing database` +25. |
| **Scam advisories** `server/index.js:219` `src/pages/AnalyzerPage.tsx:17` | `GET /scam-advisories` 5 curated cards (`phish.sinking`, `FTC`, `IC3`), fetched on mount + 24h refresh. |
| **Rate-limit UI** `server/index.js:187` `429` | `You’ve reached the limit — too many checks at once. Please wait about a minute...` `src/lib/api.ts:72` → `503` busy `The verification service is very busy... 20–30s` `server/index.js:384` |

### UX & Reliability
| Feature | Detail |
|---|---|
| **Why `500` became readable** `server/index.js:363` `src/lib/api.ts:69` | Previously `Server error. Please try again later.` `500`. Now surfaces `Gemini error 503: ...` `429: You exceeded your current quota...` `ai.dev/rate-limit` with friendly copy. |
| **Gemini model fallback** `server/index.js:315` | Tries `gemini-flash-latest` (works for `AQ.` keys) → `1.5-flash`, `2.5-flash` etc.; logs `trying ... ✓ ok` and `ListModels` on all `404`. `GEMINI_MODEL` override. |
| **AQ key support** `server/index.js:312` | `AQ.` → `x-goog-api-key` header; `AIza` → `?key=` — previous `?key=AQ...` always 404. |
| **Design system** `src/styles/tokens.css:1` | SaaS tokens: `F8FAFC` canvas, `FFFFFF` surface, `E2E8F0` border, `0F172A` ink, `2563EB` accent, `ECFDF5/FEF2F2` verdicts; `4px` space scale, `6/8/12/16` radius, `Inter` sans + `JetBrains Mono` only for %/URL/timestamp. No emoji — `lucide-react` `16/18/40px` consistent stroke. |

---

## 📋 Tech Stack

### Frontend
* **React 18 + TypeScript** `src/main.tsx:1` — strict `tsconfig.json:17`
* **Vite 5** `vite.config.ts:1` — `port 3000`, `host:true`, `proxy /analyze /health /scam-advisories → http://localhost:5000` (dev)
* **React Router 7** `src/App.tsx:1` — `/` `HomePage`, `/analyzer` `AnalyzerPage`, `/features` `FeaturesPage`, `/about` `AboutPage` + `GlobalErrorBoundary`
* **React-Bootstrap 2.9 + Bootstrap 5.3** — layout `Container/Row/Col`, forms; not for CTA (replaced by `ui/Button`)
* **Framer Motion 10** `src/lib/motion.ts:1` — `easeStandard [0.16,1,0.3,1]` `fadeUp` `staggerContainer`; `prefers-reduced-motion` respected
* **Axios 1.6** `src/lib/api.ts:1` — `POST /analyze {prompt}` `GET /health` `30s` timeout; `checkServerHealth` double-try `8s+15s`
* **Lucide React** — `ShieldCheck/ShieldAlert/ShieldX/Copy/Share2/Mail/Link2/Newspaper/FileText/ArrowRight/...` exclusive, no emoji
* **Custom UI** `src/components/ui/Button.tsx:1` — `motion.span y:-1/scale:0.98`, `variant primary #1D4ED8/white pill 9999` `secondary white/#0F172A`, avoids `btn-primary` `!important` white-on-white bug `src/App.css:1135`

### Backend
* **Node 18+ Express 4 + TypeScript** `server/src/server.ts:1` — `express.json 10mb`
* **Google Generative Language** `server/src/services/gemini.service.ts:1` — `POST https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent` `temperature 0.7 topK 40 topP 0.95 maxTokens 1024` + 4 safety `BLOCK_MEDIUM_AND_ABOVE`
* **Groq Integration** `server/src/services/groq.service.ts:1` — Alternative AI provider for text analysis
* **Security** `helmet` CSP, `cors` multi-origin `ALLOWED_ORIGINS`/`FRONTEND_URL` `server/src/server.ts:1`, dual `rateLimit` `100/15m` + `10/1m analyze`
* **Authentication** `server/src/auth/` — JWT with refresh tokens, role-based authorization

### Design System
* `src/styles/tokens.css` `globals.css` `layout.css` `src/styles/*` — decomposed from `src/App.css:2320` monolith (now editorial overrides + `272kB` built)
* `src/lib/motion.ts` shared, `prefers-reduced-motion` collapse, `transform/opacity` only

---

## 🚀 Quick Start

### One-Click Start (Windows)
```bash
run.bat  # Starts both backend and frontend servers
```

### Backend
```bash
cd server
npm install
# create server/.env
# GEMINI_API_KEY=AQ....  # or AIza... from https://aistudio.google.com/app/apikey
# PORT=5000
# NODE_ENV=development
# FRONTEND_URL=http://localhost:3000
# GEMINI_MODEL=gemini-flash-latest  # optional
npm start  # or npm run dev (nodemon)
# → GEMINI_API_KEY configured: true  http://localhost:5000/health
```

### Frontend
```bash
npm install
npm run dev            # dev defaults API_BASE_URL to http://localhost:5000 via src/config/api.ts:5 + vite proxy
# or: set VITE_API_BASE_URL=http://localhost:5000 && npm run dev
# → http://localhost:3000
```

### Env Vars
| Var | Where | Purpose |
|---|---|---|
| `GEMINI_API_KEY` | `server/.env:1` | Required. `AQ.` (new) or `AIza...` (old). New uses `x-goog-api-key` header. |
| `GEMINI_MODEL` | `server/.env` | Optional. Default `gemini-flash-latest` (works for `AQ.`). Try `gemini-1.5-flash` etc. on `404`. |
| `PORT` | `server/.env` | Default `5000` |
| `FRONTEND_URL` / `ALLOWED_ORIGINS` | `server/.env` | CORS `server/index.js:160` comma list |
| `VITE_API_BASE_URL` | frontend `.env` | Prod: `https://your-backend.onrender.com` (no `/api` prefix — server is `/analyze` direct). Dev fallback `http://localhost:5000`. |

---

## 🔌 API

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | `{status, timestamp, environment}` |
| `GET` | `/` | `{message, version, endpoints}` |
| `GET` | `/scam-advisories` | 5 curated advisories |
| `POST` | `/analyze` | `{prompt: string}` → `{result:{verdict, confidence, explanation, signals, rawText}, timestamp}` Validates `0 < len ≤ 10000`. `429` rate-limit friendly, `503` busy. |

Health is used by `Header.tsx:15` `checkServerHealth` → `Operational/Offline` dot.

---

## 🎯 How It Works

1. **Choose** `Message / Link / Article / Document` segmented control `src/components/InputForm.tsx:60` (ink active `#0F172A/white` vs `white/#334155`)
2. **Paste** full context (sender/subject for email, exact URL, headline+claim) `max 10k` + optional `.txt` attach
3. **Analyze** `Analyze →` `src/components/ui/Button.tsx` — heuristics `server/index.js:294` + Gemini structured JSON `src/lib/api.ts:17` `{"verdict":...,"confidence":...}`
4. **Read** `ResultCard` `src/components/ResultCard.tsx:61` — `Inspection` header → `87/100` mono → `Likely scam` `FEF2F2` → quote left-border → copy/share

---

## 🎨 Design Principles

Light editorial SaaS, not cyberpunk: strong `Inter` typography hierarchy first, intentional `24-48px` whitespace between concepts, subtle `1px #E2E8F0` borders, controlled `1px` top-rule elevation — not `9999px` pills everywhere, excessive gradients, glassmorphism or floating neon cards. Hero `min-height:calc(100vh - 57px)` `display:flex;alignItems:center` owns viewport; `Built for fast...` requires scroll. `maxWidth 1120→1280` + `pad 96/88` decompress; `42→64px` headline. Semantic `059669/DC2626/D97706` only for verdicts. `prefers-reduced-motion` respected.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/Button.tsx          # primary/secondary pill, motion y:-1/scale 0.98
│   ├── ui/AuthModal.tsx       # authentication modal with credit status
│   ├── ui/GoogleSignInButton.tsx  # Google OAuth integration
│   ├── ui/ConfirmDialog.tsx   # confirmation dialog component
│   ├── Header.tsx             # 14px compact, credit badge, Operational dot
│   ├── Footer.tsx             # F8FAFC/Border, ShieldCheck 18
│   ├── InputForm.tsx          # workspace 720, type tabs, Content 0/10k, attach, Analyze
│   ├── ResultCard.tsx         # verdict stripe 4px #DC2626, 28px LIKELY SCAM / 87
│   ├── Loader.tsx             # inline 16px spin 0.7s
│   └── landing/               # landing page components (Hero, Evidence, Verdict, etc.)
├── pages/
│   ├── HomePage.tsx           # 90vh hero 60px headline, video public/Vid/truth.mp4 720×460
│   ├── AnalyzerPage.tsx       # workspace + private/budget cards
│   ├── FeaturesPage.tsx       # How it works 01/02/03 + What gets checked
│   ├── AboutPage.tsx          # editorial header, snapshot, approach, principles, builder
│   ├── ExtensionPage.tsx      # browser extension page
│   ├── RegisterPage.tsx      # user registration
│   ├── SigninPage.tsx         # user sign in
│   └── ProfilePage.tsx        # user profile
├── context/
│   └── AuthContext.tsx        # authentication and credit management
├── lib/
│   ├── api.ts                 # generatePrompt per type, analyzeContent, checkServerHealth
│   ├── motion.ts              # easeStandard, fadeUp, staggerContainer
│   ├── googleAuth.ts          # Google OAuth utilities
│   ├── password.ts            # password validation
│   └── userStore.ts           # user state management
├── styles/
│   ├── tokens.css             # F8FAFC/F... palette, 4px space, Inter/JetBrains
│   ├── globals.css            # antialiased, focus-visible
│   └── layout.css             # container-narrow 720 / wide 1120
├── App.tsx                    # BrowserRouter with authentication
└── main.tsx                   # tokens+globals+layout imports, Toaster config
server/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── auth/                  # Authentication routes and middleware
│   ├── bulk/                  # Bulk analysis endpoint
│   ├── config/                # Environment configuration
│   ├── db.ts                  # Database configuration
│   ├── middleware/            # Auth and validation middleware
│   ├── routes/                # API routes (health, analyze)
│   ├── services/              # Gemini and Groq AI services
│   └── utils/                 # Logger utility
├── index.js                   # Legacy server entry (being migrated)
└── package.json
browser-extension/
├── src/
│   ├── background/            # Service worker
│   ├── content/               # UI injector
│   ├── options/               # Options page
│   └── shared/                # Shared utilities
├── manifest.json              # Extension manifest
└── tsconfig.json              # TypeScript config
run.bat                        # Windows startup script
commits.md                     # Commit strategy documentation
```

---

## 🚀 Deployment

**Frontend Vercel**
* Build: `npm run build` → `dist`
* Env: `VITE_API_BASE_URL=https://your-backend.onrender.com`

**Backend Render/Railway**
* Root `server`, `node index.js`, Node ≥18, `npm install`
* Envs: `GEMINI_API_KEY`, `NODE_ENV=production`, `FRONTEND_URL=https://your-frontend.vercel.app`, optional `GEMINI_MODEL`, `ENABLE_REPUTATION_CHECKS=1`, `ALLOWED_ORIGINS`

Vite proxy handles dev `400`/`404`; prod needs `VITE_API_BASE_URL` (no `/api` prefix).

---

## 🙏 Acknowledgments

* Google Gemini `gemini-flash-latest` via Generative Language `v1beta`
* Lucide React (outline, `16/14/12px`)
* Framer Motion, React-Bootstrap

---

**⚠️ Disclaimer:** Heuristic + model output. Always verify via official sources. Do not use as sole basis for financial/legal decisions.
