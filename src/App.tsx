import React, { useState } from "react";
import "./App.css";
import Model from "./vrm";
import { useVRM } from "./lib/useVRM";
import { listVRMS } from "./contants";

function App() {
  
  const vrm = useVRM("/models/nu2_bo2.vrm").vrm;
  const vrm2 = useVRM("/models/nu1.vrm").vrm;
  const vrm3 = useVRM("/models/nv_nuden2.vrm").vrm;
  const vrm4 = useVRM("/models/nu2_bo1.vrm").vrm;
  const vrm5 = useVRM("/models/nu2_bo3.vrm").vrm;
  const vrm6 = useVRM("/models/nv_nuden1.vrm").vrm;


  const modelPaths = [vrm, vrm2, vrm3, vrm4, vrm5, vrm6];

  const [selectedVRMA, setSelectedVRMA] = useState<string>(listVRMS[0].value);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVRMA(event.target.value);
    // setLoading(true);
    // setProgress(0); // Reset lại thanh tiến trình khi chọn VRMA mới
  };

  return (
    <div className="App">
      <div
        style={{
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flex: 1,
          marginBottom: 20,
        }}
      >
        <label>Select Action</label>

        <select
          style={{ marginLeft: 10 }}
          name="select-vrma"
          id="select-vrma"
          value={selectedVRMA}
          onChange={handleChange}
        >
          {listVRMS.map((fileVRMA, index) => (
            <option key={index} value={fileVRMA.value}>
              {fileVRMA.name}
            </option>
          ))}
        </select>
      </div>
      <div className="model-grid">
        {modelPaths.map((vrm, index) => (
          <div key={index} className="model-container">
            {vrm !== null ? (
              <Model vrm={vrm} selectedVRMA={selectedVRMA} />
            ) : (
              <div>Loading...</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
