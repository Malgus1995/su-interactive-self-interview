// components/IdealType.jsx
import React from "react";

export default function IdealType({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        animation: "fadeIn 0.3s ease-out",
      }}
    >
      <div
        style={{
          width: "90%",
          maxWidth: "500px",
          background: "rgba(255,255,255,0.96)",
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          padding: "24px 28px",
          lineHeight: "1.7",
          backdropFilter: "blur(6px)",
          position: "relative",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "10px" }}>이상형</h2>
        <p style={{ fontSize: "15px", whiteSpace: "pre-line" }}>
          30대 (1995년생), 185cm, 80kg, 창원 거주{"\n\n"}
          다정하고 자상하며 자기계발을 꾸준히 합니다.{"\n"}
          상대방과의 정서적 공감을 중요하게 생각하며,{"\n"}
          물질적 가치보다 사람의 내면을 더 소중히 여깁니다.{"\n\n"}
          너무 완벽하지 않아도 됩니다.{"\n"}
          삶이라는 여정에서 서로를 이해하고, 함께 성장하며{"\n"}
          곁을 지켜주는 따뜻한 분을 기다리고 있습니다.
        </p>

        <button
          onClick={onClose}
          style={{
            marginTop: "16px",
            display: "block",
            marginLeft: "auto",
            background: "#ffce00",
            border: "none",
            borderRadius: "8px",
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          닫기
        </button>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
