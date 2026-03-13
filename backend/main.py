from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl, EmailStr
from typing import List
from datetime import datetime

app = FastAPI(title="Unizoy Job Board API")

# Allow your frontend during development
origins = [
    "http://localhost:5173",      # Vite dev server
    "https://unizoy.netlify.app", # <- no trailing slash
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ----- Pydantic models -----

class JobCreate(BaseModel):
    title: str
    description: str
    location: str | None = None
    salaryRange: str | None = None


class Job(BaseModel):
    id: int
    title: str
    description: str
    location: str | None = None
    salaryRange: str | None = None
    createdAt: str


class ApplicationCreate(BaseModel):
    name: str
    email: EmailStr
    resumeUrl: HttpUrl


class Application(BaseModel):
    id: int
    jobId: int
    jobTitle: str
    name: str
    email: EmailStr
    resumeUrl: HttpUrl
    createdAt: str


# ----- In-memory storage -----

jobs: List[Job] = []
applications: List[Application] = []
job_id_counter = 1
app_id_counter = 1


# ----- Routes -----

@app.get("/jobs", response_model=List[Job])
def list_jobs():
    return jobs


@app.post("/jobs", response_model=Job, status_code=201)
def create_job(payload: JobCreate):
    global job_id_counter
    new_job = Job(
        id=job_id_counter,
        title=payload.title,
        description=payload.description,
        location=payload.location or "",
        salaryRange=payload.salaryRange or "",
        createdAt=datetime.utcnow().isoformat(),
    )
    jobs.append(new_job)
    job_id_counter += 1
    return new_job


@app.get("/applications", response_model=List[Application])
def list_applications():
    return applications


@app.post("/jobs/{job_id}/apply", response_model=Application, status_code=201)
def apply_to_job(job_id: int, payload: ApplicationCreate):
    global app_id_counter

    # Find job
    job = next((j for j in jobs if j.id == job_id), None)
    if job is None:
        raise HTTPException(status_code=404, detail="Job not found")

    new_application = Application(
        id=app_id_counter,
        jobId=job.id,
        jobTitle=job.title,
        name=payload.name,
        email=payload.email,
        resumeUrl=payload.resumeUrl,
        createdAt=datetime.utcnow().isoformat(),
    )
    applications.append(new_application)
    app_id_counter += 1
    return new_application