from fastapi import APIRouter

router = APIRouter(prefix="/autumn", tags=["autumn"])


@router.get("/init_point")
def get_init_message():
    return {
         "description":
            "외로움을 많이 탔었던 저는 친구들과 어울리기를 좋아했습니다. 어른들 말씀으론 다른 아이들보단 순수하였다고 합니다.",
    }
@router.get("/machine_point")
def machine_message():
    return {
         "description":
            "어렸을적부터 기계에 관심이 많았습니다. 5살때 피자집에서 어머니가 잠깐 딴짓하는 사이에 전등 만져서 혼자 뽑아 버릴 정도로 호기심이 많았습니다.",
    }

def people_message():
    return {
         "description":
            "화목한 가정에서 자랐습니다. 부모님은 늘 저를 믿어주셨고, 선하고 바른 마음씨를 가지도록 사랑으로 키워주셨습니다. 이는 제가 인생을 살아가는데, 중요한 영향력을 주었습니다.",
    }
    
def study_and_exercise_message():
    return {
         "description":
            "학업과 운동은 어릴때 잘하지 못했습니다. 노력했었지만 반타작정도 했었습니다. 그런데 뒷머리가 있다고들 어른들이 말씀하셨었는데, 그게 맞는것 같습니다. 학습하는 시간은 오래걸리지만, 한번 이해하면 오래 기억하는 편이고 응용을 잘하는 편인 것 같습니다.",
    }
