import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PanelsPage from "./pages/PanelsPage";
import LastPage from "./pages/LastPage";
//
//
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/panels" element={<PanelsPage />} />
        <Route path="/last" element={<LastPage />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
    </>
  );
}

export default App;
