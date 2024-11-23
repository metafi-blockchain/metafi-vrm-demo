import React, { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import TheHeader from "./components/header/TheHeader";
import VrmaNu1 from "./components/nu1/VrmaNu1";
import { VRM } from "@pixiv/three-vrm";
import { useVRM } from "./lib/useVRM";

function App() {
  const [selectedVRMA, setSelectedVRMA] = useState("");
  const [vrm, setVrm] = useState<VRM | null>(null);

  // const [loading, setLoading] = useState(false);

  const listVRMS = [
    {
      value: "/vrmas/VRMA_01.vrma",
      name: "VRMA_01",
      image: "/image/vrma01.png",
    },
    {
      value: "/vrmas/VRMA_02.vrma",
      name: "VRMA_02",
      image: "/image/vrma02.png",
    },
    {
      value: "/vrmas/VRMA_03.vrma",
      name: "VRMA_03",
      image: "/image/vrma03.png",
    },
    {
      value: "/vrmas/VRMA_04.vrma",
      name: "VRMA_04",
      image: "/image/vrma04.png",
    },
    {
      value: "/vrmas/VRMA_05.vrma",
      name: "VRMA_05",
      image: "/image/vrma05.png",
    },
    {
      value: "/vrmas/VRMA_06.vrma",
      name: "VRMA_06",
      image: "/image/vrma06.png",
    },
    {
      value: "/vrmas/VRMA_07.vrma",
      name: "VRMA_07",
      image: "/image/vrma07.png",
    },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVRMA(event.target.value);
  };

  return (
    <div className="App">
      <TheHeader />
      <Routes>
        <Route
          path="/"
          element={
            <VrmaNu1
              vrm={vrm}
              selectedVRMA={selectedVRMA}
              listVRMS={listVRMS}
              handleChange={handleChange}
            />
          }
        />
        <Route path="/Nu2" element={<div>Nu2 Component</div>} />
      </Routes>
    </div>
  );
}

export default App;
