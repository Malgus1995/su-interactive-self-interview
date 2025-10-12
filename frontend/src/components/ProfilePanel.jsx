/*import { useEffect, useState } from "react";
import axios from "axios";

export default function ProfilePanel() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/about").then((res) => setData(res.data));
  }, []);

  if (!data) return <p>Loading profile...</p>;

  return (
    <div>
      <h2>{data.name}</h2>
      <p>{data.description}</p>
      <a href="https://mgsuj.tistory.com" target="_blank">SU Library 블로그</a>
    </div>
  );
}
*/

export default function ProfilePanel() {
  const data = {
    description:
      "나솔 13기 광수님의 셀소.com을 보고 감명받아서 만든 저의 셀프 소개 페이지입니다.",
  };

  return (
    <div style={{ textAlign: "center", marginBottom: "4px" }}>
      <p style={{ margin: "0 0 2px 0" }}>{data.description}</p>
      <a
        href="https://mgsuj.tistory.com"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#5C7AEA", textDecoration: "none" }}
      >
        SU Library 블로그
      </a>
    </div>
  );
}