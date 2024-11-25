import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Model from "./vrm";
import { useVRM } from "./lib/useVRM";
import VRMDetail from "./components/VRMDetail";

function App() {
  const [selectedVRM, setSelectedVRM] = useState<string>("vrm1");

  const vrm1 = useVRM("/models/nu2_bo2.vrm").vrm;
  const vrm2 = useVRM("/models/nu2_bo3.vrm").vrm;

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVRM(event.target.value);
  };

  return (
    <Router>
      <div className="App">
        <div>
          <label htmlFor="select-vrm">Chọn VRM: </label>
          <select id="select-vrm" onChange={handleChange}>
            <option value="vrm1">VRM 1</option>
            <option value="vrm2">VRM 2</option>
          </select>
        </div>

        <Routes>
          <Route path="/vrm/:value" element={<VRMDetail />} />

          <Route
            path="/"
            element={
              selectedVRM === "vrm1" && vrm1 !== null ? (
                <Model vrm={vrm1} />
              ) : selectedVRM === "vrm2" && vrm2 !== null ? (
                <Model vrm={vrm2} />
              ) : (
                <div>Loading...</div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
