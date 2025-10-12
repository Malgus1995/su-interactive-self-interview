import { useState, useEffect } from "react";
import IntroCanvas from "./components/IntroCanvas";
import ProfilePanel from "./components/ProfilePanel";
import DialogueBox from "./components/DialogueBox";

export default function App() {
  const [dialogText, setDialogText] = useState(
    "어서 와. 여긴 두 번째 방이야. 아주 긴 텍스트를 테스트하기 위해 여러 줄의 대화가 이어집니다. 이렇게 길어져도 대화박스 내부에서만 스크롤이 생기고, 전체 화면은 고정됩니다. 모바일에서도 부드럽게 작동합니다. 계속해서 텍스트가 이어집니다... 끝까지 내려야 읽을 수 있습니다. 잘 동작하나요?"
  );

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
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
      {/* ✅ 상단 블로그 안내 */}
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

      {/* ✅ 게임 화면: PC에서는 600px 제한, 모바일은 전체 폭 */}
      <div
        style={{
          flexGrow: 1,
          width: isMobile ? "100vw" : "100%",
          maxWidth: isMobile ? "100vw" : "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <IntroCanvas setDialogText={setDialogText} />
      </div>

      {/* ✅ 하단 텍스트 박스 */}
      <div
        style={{
          width: isMobile ? "100vw" : "100%",
          maxWidth: isMobile ? "100vw" : "600px",
          height: "22vh", // 🎯 파란선 비율 유지
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
        <div
          dangerouslySetInnerHTML={{
            __html: dialogText
              .replace(/\n/g, "<br/>")
              .replace(/인터랙티브 셀소/, "<b>인터랙티브 셀소</b>")
              .replace(/오른쪽 출구/, "<b style='color:#0055ff;'>오른쪽 출구</b>")
              .replace(/클릭/, "<b>클릭</b>"),
          }}
        />
      </div>
    </div>
  );
}
