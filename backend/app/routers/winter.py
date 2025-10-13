from fastapi import APIRouter

router = APIRouter(prefix="/winter", tags=["winter"])


@router.get("/init_point")
def get_init_message():
    return {
         "description":
            "그러나 제 인생에서 가장 힘들었던 시기는 20대 였습니다. 우연히 성적에 맞춰 입학한 커퓨터라는 전공을 선택하게 되었지만, 제 인생을 바꿔 놓는 계기가 되었습니다.",
    }
@router.get("/language_point")
def language_message():
    return {
         "description":
            "처음 C언어를 공부할땐, 정말 30분도 집중하기 힘들었습니다. 고등학교 때 문과를 선택하였기에, 프로그래밍 외에도 대학수학, 물리 등 챙겨야할 기초 교양과목들도 상당히 버겁게 느껴졌었습니다. 하지만 포기하지않고 꾸준히 자신과의 싸움을 이겨낸 결과 저는 전공을 살린일을 하고있고, Python이라는 언어는 제가 제일 좋아하는 언어가 되었습니다.",
    }

@router.get("/notebook_point")
def notebook_message():
    return {
         "description":
            "그 과정이 마냥 순탄치만은 않았습니다. 컴퓨터의 모든 분야를 정복할 수는 없었기에, Fit하다 생각한 전공이 없던 저는 불확실한 미래에 대한 불안감으로 주변을 돌아보지 않았고 선택한 길의 실패를 두려워하여 동굴로 들어가게 되었습니다.",
    }
    
@router.get("/communication_point")
def communication_message():
    
    return {
         "description":
            "그럼에도 다행히 그속에서 연구를 하고싶은 새로운 꿈이 생겼었고, 큰 실패는 하지않으며 어느정도 내외적으로 성장하는 시간을 가졌습니다. 그동안 제가 부족한 모습을 보였음에도 불구하고 저를 믿어준 친구들로 인해 다시 동굴밖을 나올 수 있었습니다."
    } 

@router.get("/master_degree_point")
def master_degree_message():
    return {
         "description":
            "원하는 학교의 연구실로 입학하며 졸업까지의 과정도... 사실 순탄치는 않았지만, 그래도 입학 전 되고 싶었던 연구자의 모습에 어느정도 도달한 것 같습니다. 학위과정 중, SCI 논문 2편을 퍼블리시하는 등의 실적을 달성하며, 현재 기업에서도 대학원 때의 전공을 살린 일을 하며, 인정받으며 지내고 있습니다."
            } 
    
@router.get("/path_point")
def mwinter_path_message():
    return {
         "description":
            "T성향이 강하고 미래지향적인점이 강했던 과거의 저는 감사함을 잘 몰랐었지만, 현재 저는 지난 과정을 되돌아보면 참 복받은 사람인것 같습니다. 요즘은 친구들을 만나면 보고싶었다. 고맙다. 라는 표현을 자주하지만, 과거에는 부끄러움이 많아 잘 표현하지 못했던것이 아쉬움으로 남습니다."
    } 