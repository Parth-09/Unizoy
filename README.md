# Unizoy Job Board

Simple Job Board for **Unizoy**.

- **Admin**: post jobs, browse jobs, view recent applications
- **Candidate**: apply with name, email, and resume link

## Tech stack

- **Frontend**: React + TypeScript (Vite)
- **Backend**: FastAPI (Python) + Uvicorn
- **Storage**: in-memory (no database). Restarting the backend clears jobs/applications.

## Project structure

- `frontend/` – React app (UI)
- `backend/` – FastAPI app (API)

## API endpoints

- `GET /jobs` → list jobs
- `POST /jobs` → create job
- `GET /applications` → list applications
- `POST /jobs/{job_id}/apply` → apply to a job

## Run locally

### 1) Backend (FastAPI)

From the project root:

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 4000
```

Open Swagger docs at `http://localhost:4000/docs`.

### 2) Frontend (React)

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Notes

- The frontend is configured to call `http://localhost:4000` (see `frontend/src/App.tsx`).
- If you deploy the backend, update the frontend `API_BASE_URL` to your deployed API URL.

## Deployment (suggested)

- **Backend (FastAPI)**: Render / Railway / Fly.io
- **Frontend (Vite)**: Netlify / Vercel

After deployment, include:

- **GitHub repo**: `<paste link>`
- **Deployed app**: `<paste link>`

