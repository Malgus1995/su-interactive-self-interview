from fastapi import APIRouter

router = APIRouter()

@router.get("/about")
def get_about():
    return {
        "name": "정수정",
        "description": "FastAPI와 React로 만든 자기소개 인터랙티브 페이지!",
        "skills": ["Python", "FastAPI", "React", "Phaser"]
    }
