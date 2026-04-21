# 🏁 100% Free Deployment Guide - Step-by-Step

Follow these steps exactly to get your university project live for free.

## Step 0: Push your code to GitHub
Make sure all the changes I've made are committed and pushed to your GitHub repository.
1. `git add .`
2. `git commit -m "Configure cloud deployment"`
3. `git push origin main`

---

## Step 1: Create a Free Database (Neon.tech)
We will use Neon because Render's free database expires after 90 days.
1. Go to [Neon.tech](https://neon.tech) and create a free account.
2. Create a new project named `docintel`.
3. **Copy the "Connection String"** (it looks like `postgresql://user:pass@ep-hostname.aws.neon.tech/neondb?sslmode=require`). **Save this.**

---

## Step 2: Deploy Backend (Render)
1. Go to [Render.com](https://render.com) and log in with GitHub.
2. Click **New +** > **Blueprint**.
3. Select your DocIntel repository.
4. Render will read your `render.yaml` file and ask for these variables:
    - `GEMINI_API_KEY`: Paste your key.
    - `DATABASE_URL`: Paste the string from **Step 1**.
    - `ALLOWED_ORIGINS`: Leave this blank for **3 minutes** (we'll come back to it).
5. Click **Apply**. 

> [!NOTE]
> Once deployed, copy your **Backend URL** (e.g., `https://docintel-backend.onrender.com`).

---

## Step 3: Deploy Frontend (Vercel)
1. Go to [Vercel.com](https://vercel.com) and log in with GitHub.
2. Click **Add New** > **Project**.
3. Select your DocIntel repository.
4. In the **Environment Variables** section, add:
    - **Key**: `VITE_BACKEND_URL`
    - **Value**: Paste your **Backend URL** from Step 2.
5. Click **Deploy**.

> [!NOTE]
> Once deployed, copy your **Vercel URL** (e.g., `https://doc-intel-app.vercel.app`).

---

## Step 4: Final Connection (Sync)
Now we tell the backend to trust your new Vercel site.
1. Go back to your **Render Dashboard**.
2. Select your `docintel-backend` service.
3. Go to the **Environment** tab.
4. Edit `ALLOWED_ORIGINS` and paste your **Vercel URL** from Step 3.
5. Save changes. Render will redeploy automatically.

---

## 🏆 Review Day: How to Shine
**5 minutes before your reviewer arrives:**
1. Open your Vercel site.
2. Ask one test question.
3. If it says "Connection Error", just wait (the backend is waking up). 
4. Once it answers, **the project is primed and ready** for your live demo!

Everything is configured. You are good to go!
