import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import summer, about, autumn, winter, spring

app = FastAPI(title="SU Interactive Portfolio")

# ✅ Render & Local CORS 허용
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://su-interactive-self-interview-frontend.onrender.com",
        "http://localhost:5173",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 라우터 등록
app.include_router(about.router)
app.include_router(summer.router)
app.include_router(autumn.router)
app.include_router(winter.router)
app.include_router(spring.router)

@app.get("/")
def root():
    return {"message": "SU Backend is running on Render!"}

@app.get("/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)
