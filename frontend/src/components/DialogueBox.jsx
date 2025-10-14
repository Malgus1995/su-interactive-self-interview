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
      style={{
        position: "absolute",
        bottom: "0",
        left: "50%",
        transform: "translateX(-50%)",
        width: "90%",
        maxWidth: "700px",
        background: "rgba(255,255,255,0.9)",
        border: "2px solid #dcdcdc",
        borderRadius: "12px",
        padding: "12px 16px",
        fontSize: "16px",
        lineHeight: 1.5,
        maxHeight: "180px",
        overflowY: "auto",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
      }}
    >
      {text || "Loading..."}
    </div>
  );
}
