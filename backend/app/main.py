from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import summer, about, autumn, winter,spring

app = FastAPI(title="SU Interactive Portfolio")

# ✅ CORS 허용 (로컬 & Render 모두)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 필요 시 도메인 제한 가능
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
def read_root():
    return {"message": "SU Backend is running!"}
