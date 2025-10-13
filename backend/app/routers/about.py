from fastapi import APIRouter

router = APIRouter(prefix="/about",tags=["about"])

@router.get("/intropage")
def get_about():
    return {
         "description":
            "나솔 13기 광수님의 셀소.com을 보고 감명받아서 만든 저의 셀프 소개 페이지입니다.",
    }
