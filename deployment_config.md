# Connectivity Cheat Sheet - DocIntel AI

Follow this guide to connect your Vercel frontend and Render backend.

## 1. Get your URLs
- **Render URL**: Found in your Render Dashboard (e.g., `https://docintel-backend.onrender.com`)
- **Vercel URL**: Found in your Vercel Dashboard (e.g., `https://doc_intel.vercel.app`)

---

## 2. Configure Vercel (Frontend)
Go to **Vercel Project Settings > Environment Variables** and add:

| Key | Value | Goal |
| :--- | :--- | :--- |
| `VITE_BACKEND_URL` | `https://your-backend-url.onrender.com` | Tells the frontend where to send queries. |

> [!IMPORTANT]
> Do **not** add a trailing slash to the URL. If your backend is `https://foo.render.com/`, use `https://foo.render.com`.

---

## 3. Configure Render (Backend)
Go to **Render Service Settings > Environment Variables** and add:

| Key | Value | Goal |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | `your-google-api-key` | Enables AI answer generation. |
| `ALLOWED_ORIGINS` | `https://your-vercel-url.vercel.app` | Permits the frontend to securely access the API. |
| `DATABASE_URL` | `your-db-connection-string` | (Self-configured by Render if using Postgres). |

---

## 4. Troubleshooting
- **CORS Error**: Ensure the `ALLOWED_ORIGINS` in Render exactly matches your Vercel URL.
- **Failed to Fetch**: Ensure `VITE_BACKEND_URL` in Vercel is correct and your Render service is "Live".
