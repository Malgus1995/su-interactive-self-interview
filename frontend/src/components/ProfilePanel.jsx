export default function ProfilePanel() {
  const data = {
    description:
      "나솔 13기 광수님의 셀소.com을 보고 감명받아서 만든 저의 셀프 소개 페이지입니다.",
  };

  return (
    <div
      style={{
        textAlign: "center",
        marginBottom: "4px",
        position: "relative",
        zIndex: 1,
        transform: "translateZ(0)",
        WebkitTransform: "translateZ(0)",
      }}
    >
      <p
        style={{
          margin: "0 0 2px 0",
          color: "#000", // ✅ 텍스트를 확실하게 검은색으로 고정
          fontWeight: 400,
          fontSize: "15px",
          lineHeight: "1.5",
        }}
      >
        {data.description}
      </p>

      <a
        href="https://mgsuj.tistory.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: "#5C7AEA",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        SU Library 블로그
      </a>
    </div>
  );
}
