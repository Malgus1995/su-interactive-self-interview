from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import about
from app.routers import summer
from app.routers import autumn
from app.routers import winter
from app.routers import spring
app = FastAPI(title="SU Interactive Portfolio API",
    description="This API powers the interactive self-introduction app using FastAPI + React + Phaser.",
    version="1.0.0")

origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(about.router)
app.include_router(summer.router)
app.include_router(autumn.router)
app.include_router(winter.router)
app.include_router(spring.router)