import React from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { VRM } from "@pixiv/three-vrm";

interface VrmaNu1Props {
  vrm: VRM | null;
  selectedVRMA: string;
  listVRMS: { name: string; value: string }[];
  handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const VrmaNu1: React.FC<VrmaNu1Props> = ({
  vrm,
  selectedVRMA,
  listVRMS,
  handleChange,
}) => {
  return (
    <div className="col-4">
      <div>
        <label htmlFor="select-vrma">Chọn VRMA: </label>
        <select
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
      {vrm && vrm.scene ? (
        <Canvas
          flat
          style={{
            width: "100%",
            height: "500px",
            backgroundColor: "#ccc",
          }}
        >
          <PerspectiveCamera makeDefault position={[-0.12, 1, 4]} />
          <OrbitControls />
          <directionalLight />
          <primitive object={vrm.scene} />
        </Canvas>
      ) : (
        <div>{vrm ? "Loading VRM..." : "No VRM loaded"}</div>
      )}
    </div>
  );
};

export default VrmaNu1;
