import { useEffect, useState } from "react";
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
