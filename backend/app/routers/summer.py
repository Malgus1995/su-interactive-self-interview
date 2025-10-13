from fastapi import APIRouter

router = APIRouter(prefix="/summer", tags=["summer"])

@router.get("/init")
def get_init_message():
    return {
         "description":
            "저는 여름에 태어났습니다. 이곳은 제가 태어난 계절을 표현한 페이지입니다. 화면을 클릭하여 캐릭터를 움직일 수 있습니다. 특정 장소를 도달하면, 숨겨진 이야기가 나타납니다.",
    }

@router.get("/sea_point")
def watch_sea_message():
    return {
         "description":
            "저는 바다를 감상하는 것을 즐깁니다. 드넓은 지평선을 바라보며 미래, 과거, 현재를 생각하곤 합니다.",
    }