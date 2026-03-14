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

Open Swagger docs at `https://unizoy.onrender.com/docs`.
Currently API_BASE_URL is set to `https://unizoy.onrender.com`
For running the application locally, change it to `http://localhost:4000`

### 2) Frontend (React)

In a second terminal:

```powershell
cd frontend
npm install
npm run dev
```

## Deployment (suggested)

- **Backend (FastAPI)**: Render 
- **Frontend (Vite)**: Netlify

After deployment, include:

- **GitHub repo**: `https://github.com/Parth-09/Unizoy`
- **Deployed app**: `https://unizoy.netlify.app/`

