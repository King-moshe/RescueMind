<!-- rescueMind — Copilot instructions for AI coding agents -->

Summary
-------
This repo is a small two-tier web app: a React client (client/) and an Express API server (server/) that accepts image uploads and calls Google Gemini to analyze images. Focus your changes on the specific area requested; prefer small, testable edits.

Key files & flow
---------------
- server/app.js — Express server entry. Mounts routes under /api/images.
- server/routes/imageRoutes.js — POST /predict expects multipart/form-data with field name "image".
- server/middlewares/uploadMiddleware.js — multer disk storage saves files to top-level uploads/ (max 5MB). Use this for file handling patterns.
- server/controllers/imageController.js — orchestrates upload → geminiService → response and deletes uploaded files after processing.
- server/services/geminiService.js — calls the GoogleGenerativeAI SDK using process.env.GEMINI_API_KEY. Returns {status:'success', data:{analysis: <text>}} on success.
- client/src/pages/AIRecommendations.js — example client upload: creates FormData, appends 'image', posts to http://localhost:5000/api/images/predict and expects data.data.analysis in the JSON response.

Design & conventions (do not invent new patterns without justification)
---------------------------------------------------------------
- Single responsibility: controllers route → validate → call service; services encapsulate external API logic (see `imageController.js` and `geminiService.js`).
- No DB layer present — persistent state is not used. Prefer ephemeral processing and deleting uploads after use (follow `imageController.js` behavior).
- Environment secrets: GEMINI_API_KEY is read from process.env in `geminiService.js`. Do not log secret values; only log presence as the code already does.
- Error handling: services throw Errors; controllers translate them to HTTP responses. Preserve this pattern when adding features.
- File uploads: multipart/form-data with field name 'image'. Follow `uploadMiddleware.js` fileFilter and limits.

Build, run & debug tips
------------------------
- Start server: cd server && npm start (runs node app.js on port from PORT or 5000). See `server/package.json`.
- Start client: cd client && npm start (CRA default on port 3000). The client currently calls the server at http://localhost:5000 — update env/cors if you change ports.
- Local testing: use the UI at /AIRecommendations to capture/upload images, or POST a multipart/form-data request to http://localhost:5000/api/images/predict with field name `image`.
- Gemini key: set GEMINI_API_KEY in server/.env or your environment. The service verifies presence and returns clear errors when missing/invalid.

Patterns & examples to reuse
----------------------------
- Use the exact JSON response shape the client expects: { status: 'success', data: { analysis: <text> } } for success. See `geminiService.js` return value and `AIRecommendations.js` parsing.
- When adding new routes that accept files, reuse `uploadMiddleware.js` to maintain consistent file saving, filtering and size limits.
- For external API calls, keep network code in `server/services/*` and error normalization similar to `geminiService.js` (wrap details, rethrow meaningful messages).

Integration points & external deps
----------------------------------
- Google Generative AI SDK: `@google/generative-ai` (see `server/package.json`). Code instantiates GoogleGenerativeAI and calls getGenerativeModel().
- multer for uploads in `server/middlewares/uploadMiddleware.js`.
- The client uses browser APIs to capture an image and converts dataURI to Blob before sending FormData (see `dataURItoBlob` in `client/src/pages/AIRecommendations.js`).

When modifying code, prefer small, reviewable commits
---------------------------------------------------
- Keep controller/service boundaries unchanged unless you implement a cross-cutting change.
- Add unit tests only if you can run them locally and they are fast; otherwise add a small integration test and document how to run it.

If you need clarification
------------------------
- Ask where to place new routes, whether to add persistent storage, and whether to change the API response shape. If you propose new env vars, document them in server/README or .env.example.

Files to inspect first
---------------------
- server/app.js
- server/routes/imageRoutes.js
- server/controllers/imageController.js
- server/services/geminiService.js
- server/middlewares/uploadMiddleware.js
- client/src/pages/AIRecommendations.js

End of file
