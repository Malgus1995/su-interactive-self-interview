import { useState, useEffect, useCallback } from "react";
import IntroCanvas from "./components/IntroCanvas";
import SecondCanvas from "./components/SecondCanvas";
import ThirdCanvas from "./components/ThirdCanvas";
import LastCanvas from "./components/LastCanvas";
import ProfilePanel from "./components/ProfilePanel";
import IdealType from "./components/IdealType"; // ✅ 추가

export default function App() {
  const [dialogHistory, setDialogHistory] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("intro");
  // ✅ IdealType 모달 상태
  const [showIdealModal, setShowIdealModal] = useState(false);

useEffect(() => {
    const keepAlive = () => {
      fetch(import.meta.env.VITE_API_BASE_URL + "/health").catch(() => {});
    };
    keepAlive();
    const interval = setInterval(keepAlive, 10 * 60 * 1000); // 10분마다
    return () => clearInterval(interval);
  }, []);
  
// ✅ 버튼 클릭 리스너 재연결
useEffect(() => {
  const attachIdealButtonEvents = () => {
    document.querySelectorAll(".ideal-btn").forEach((btn) => {
      btn.onclick = () => setShowIdealModal(true);
    });
  };

  // 버튼이 새로 생기거나, 모달 닫혔을 때 재연결
  attachIdealButtonEvents();

  // MutationObserver로 버튼 DOM 변화 감지 → 항상 이벤트 유효화
  const observer = new MutationObserver(() => attachIdealButtonEvents());
  const container = document.getElementById("dialog-container");
  if (container) observer.observe(container, { childList: true, subtree: true });

  return () => observer.disconnect();
}, [showIdealModal]);

  // ✅ 안전한 setter
const handleDialogUpdate = useCallback((newText) => {
  if (!newText) return;

  // 단순 문자열이면 그대로 출력
  if (typeof newText === "string") {
    setDialogHistory((prev) => {
      if (prev[prev.length - 1] === newText) return prev;
      return [...prev, newText];
    });
    return;
  }

  // ✅ 트리거가 있는 경우
  if (typeof newText === "object" && newText.text) {
    if (newText.trigger === "idealType") {
      const htmlWithButton = `
        ${newText.text} <button class="ideal-btn">이상형 보기</button>`;
      setDialogHistory((prev) => [...prev, htmlWithButton]);

      // ✅ 버튼 이벤트는 항상 최신 대화창에 연결
      setTimeout(() => {
        document.querySelectorAll(".ideal-btn").forEach((btn) => {
          btn.onclick = () => setShowIdealModal(true);
        });
      }, 200);
    } else {
      setDialogHistory((prev) => [...prev, newText.text]);
    }
  }
}, []);


  // ✅ 방 이동 콜백들
  const handleEnterSecondRoom = useCallback(() => setCurrentRoom("second"), []);
  const handleEnterThirdRoom = useCallback(() => setCurrentRoom("third"), []);
  const handleEnterLastRoom = useCallback(() => setCurrentRoom("last"), []);
  const handleBackToFirstRoom = useCallback(() => {
    setDialogHistory([]);
    setCurrentRoom("intro");
  }, []);

  // ✅ 자동 스크롤
  useEffect(() => {
    const box = document.getElementById("dialog-container");
    if (box) {
      requestAnimationFrame(() => {
        box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
      });
    }
  }, [dialogHistory]);

  // ✅ 반응형
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          background: "#f5f5f5",
          overflow: "hidden",
        }}
      >
        {/* 상단 프로필 */}
        <div
          style={{
            width: isMobile ? "100vw" : "100%",
            textAlign: "center",
            flexShrink: 0,
            padding: "12px 0 4px",
            background: "#fff",
          }}
        >
          <ProfilePanel />
        </div>

        {/* ✅ 현재 방 전환 */}
        <div
          style={{
            flexGrow: 1,
            width: isMobile ? "100vw" : "100%",
            maxWidth: isMobile ? "100vw" : "600px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "#fff",
          }}
        >
          {(() => {
            switch (currentRoom) {
              case "intro":
                return (
                  <IntroCanvas
                    setDialogText={handleDialogUpdate}
                    onEnterSecondRoom={handleEnterSecondRoom}
                  />
                );
              case "second":
                return (
                  <SecondCanvas
                    setDialogText={handleDialogUpdate}
                    onEnterThirdRoom={handleEnterThirdRoom}
                    onBackToFirstRoom={handleBackToFirstRoom}
                  />
                );
              case "third":
                return (
                  <ThirdCanvas
                    setDialogText={handleDialogUpdate}
                    onEnterLastRoom={handleEnterLastRoom}
                    onBackToSecondRoom={handleEnterSecondRoom}
                  />
                );
              case "last":
                return (
                  <LastCanvas
                    setDialogText={handleDialogUpdate}
                    onBackToFirstRoom={handleBackToFirstRoom}
                  />
                );
              default:
                return null;
            }
          })()}
        </div>

        {/* ✅ 대화창 */}
        <div
          id="dialog-container"
          style={{
            width: isMobile ? "100vw" : "100%",
            maxWidth: isMobile ? "100vw" : "600px",
            height: "22vh",
            background: "#fff",
            borderRadius: isMobile ? "0" : "12px",
            boxShadow: "0 -2px 10px rgba(0,0,0,0.1)",
            padding: "16px 20px",
            lineHeight: "1.7",
            color: "#222",
            marginTop: "4px",
            overflowY: "auto",
            wordBreak: "keep-all",
            boxSizing: "border-box",
          }}
        >
          {dialogHistory.map((line, i) => (
            <div
              key={i}
              style={{
                marginBottom: "12px",
                borderBottom: "1px solid #eee",
                paddingBottom: "6px",
              }}
              dangerouslySetInnerHTML={{
                __html: line
                  .replace(/\n/g, "<br/>")
                  .replace(/인터랙티브 셀소/, "<b>인터랙티브 셀소</b>")
                  .replace(/오른쪽 출구/, "<b style='color:#0055ff;'>오른쪽 출구</b>")
                  .replace(/클릭/, "<b>클릭</b>"),
              }}
            />
          ))}
        </div>
      </div>

      {/* ✅ IdealType 모달 */}
      {showIdealModal && <IdealType onClose={() => setShowIdealModal(false)} />}
    </>
  );
}
