import IntroCanvas from "./components/IntroCanvas";
import ProfilePanel from "./components/ProfilePanel";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>🎮 Welcome to Sujung's Interactive Intro</h1>
      <ProfilePanel />
      <IntroCanvas />
    </div>
  );
}

export default App;
