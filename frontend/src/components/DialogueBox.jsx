import { useState, useEffect } from "react";

export default function DialogueBox({ text, visible = true }) {
  const [displayedText, setDisplayedText] = useState("");
  const [boxHeight, setBoxHeight] = useState("30vh"); // ✅ 기본값

  // ✅ 타이핑 효과
  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      return;
    }

    let i = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[i]);
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);

    return () => clearInterval(interval);
  }, [text]);

  // ✅ 화면 크기에 따라 높이 조정
  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;

      // 모바일: 세로로 긴 화면
      if (vw < 600) {
        if (vh > 800) setBoxHeight("38vh");
        else setBoxHeight("35vh");
      } else {
        setBoxHeight("28vh"); // PC나 태블릿
      }
    };

    handleResize(); // 초기 실행
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        width: "100%",
        height: boxHeight, // ✅ 반응형 높이 적용
        minHeight: "120px",
        background: "rgba(0, 0, 0, 0.85)",
        color: "#fff",
        fontSize: "1rem",
        padding: "16px 20px",
        borderRadius: "0 0 12px 12px",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.3)",
        wordBreak: "break-word",
        lineHeight: "1.6",
        overflowY: "auto", // ✅ 내부 스크롤만 허용
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-y",
        overscrollBehavior: "contain",
        scrollbarWidth: "thin",
        scrollbarColor: "#999 transparent",
      }}
    >
      {displayedText}
    </div>
  );
}
