import FileDrop from "./components/FileDrop";
import "./App.css";

function App() {
  return (
    <div style={{ padding: "48px 24px" }}>
      <h1 style={{ marginBottom: "8px" }}>Text Analyzer</h1>
      <FileDrop />
    </div>
  );
}

export default App;
