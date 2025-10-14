import { useState, useEffect, useCallback } from "react";
import IntroCanvas from "./components/IntroCanvas";
import SecondCanvas from "./components/SecondCanvas";
import ThirdCanvas from "./components/ThirdCanvas";
import LastCanvas from "./components/LastCanvas";
import ProfilePanel from "./components/ProfilePanel";

export default function App() {
  const [dialogHistory, setDialogHistory] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("intro"); // intro → second → third → last

  // ✅ 안전한 setter (중복 방지)
  const handleDialogUpdate = useCallback((newText) => {
    setDialogHistory((prev) => {
      if (!newText) return prev;
      if (prev[prev.length - 1] === newText) return prev;
      return [...prev, newText];
    });
  }, []);

  // ✅ 방 이동 콜백들
  const handleEnterSecondRoom = useCallback(() => {
    setCurrentRoom("second");
  }, []);

  const handleEnterThirdRoom = useCallback(() => {
    setCurrentRoom("third");
  }, []);

  const handleEnterLastRoom = useCallback(() => {
    setCurrentRoom("last");
  }, []);

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
  );
}
