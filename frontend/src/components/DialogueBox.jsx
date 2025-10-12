import { useEffect, useRef, useState } from "react";

export default function DialogueBox({
  text = "",
  visible = true,
  isMobile = false,
}) {
  const [dialogHistory, setDialogHistory] = useState([]); // 전체 대화 로그
  const scrollRef = useRef(null);

  // ✅ 새 텍스트 들어올 때 히스토리에 추가
  useEffect(() => {
    if (!text) return;
    setDialogHistory((prev) => {
      // ✅ 직전 대사와 동일하면 추가하지 않음
      if (prev[prev.length - 1] === text) return prev;
      return [...prev, text];
    });
  }, [text]);

  // ✅ 새 텍스트 추가 시 자동 스크롤 맨 아래로 이동
  useEffect(() => {
    if (scrollRef.current) {
      requestAnimationFrame(() => {
        scrollRef.current.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: "smooth",
        });
      });
    }
  }, [dialogHistory]);

  if (!visible) return null;

  return (
    <div
      ref={scrollRef}
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
        overflowY: "auto",       // ✅ 세로 스크롤
        overflowX: "hidden",     // ✅ 가로 스크롤 제거
        wordBreak: "break-word", // ✅ 긴 단어 줄바꿈
        whiteSpace: "pre-wrap",  // ✅ 줄바꿈 문자 유지
        boxSizing: "border-box",
        WebkitOverflowScrolling: "touch",
      }}
    >
      {dialogHistory.map((line, idx) => (
        <div
          key={idx}
          dangerouslySetInnerHTML={{
            __html: line.replace(/\n/g, "<br/>"),
          }}
          style={{ marginBottom: "10px" }}
        />
      ))}
    </div>
  );
}
