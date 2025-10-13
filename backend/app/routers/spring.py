from fastapi import APIRouter

router = APIRouter(prefix="/spring", tags=["spring"])


@router.get("/init_point")
def get_init_message():
    return {
         "description":
            "겨울이 지나고 봄이 오듯, 제 인생에도 새로운 시작이 찾아왔음을 깨닫습니다. 어제보다 더 나은 오늘을 살아가고 싶지만, 여전히 삶은 늘 바쁘게만 느껴집니다. 모든 사람에게 24시간은 부족하겠지요.",
    }

@router.get("/approach_point")
def approach_point_message():
    return {
         "description":
            "그럼에도 이 셀소를 통해 저의 둘도 없는 단짝을 찾고 있습니다. 기쁜일이 있으면 함께 기뻐하고 슬픈일이 있을땐 힘이 되어 주며, 삶이라는 여정에서 서로에게 든든한 그늘 같은 존재가 되어주었으면 좋겠습니다."
    }
    

@router.get("/kakao_point")
def kakao_message():
    return {
         "description":
            "카카오는 현재 받지않고 있습니다.",
    }