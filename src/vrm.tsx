import React, { useEffect, useLayoutEffect, useState, useRef } from "react";

// for vrm
import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";
import { useVRM } from "./lib/useVRM";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  createVRMAnimationClip,
  VRMAnimation,
  VRMAnimationLoaderPlugin,
} from "@pixiv/three-vrm-animation";
import { listVRMS } from "../src/contants";
export default function Model() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const { vrm } = useVRM();
  const [selectedVRMA, setSelectedVRMA] = useState<string>(listVRMS[0].value);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const resizeCanvas = () => {
      root.style.width = `${document.documentElement.clientWidth}px`;
      root.style.height = `${document.documentElement.clientHeight}px`;
    };
    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVRMA(event.target.value);
  };

  return (
    <div ref={rootRef}>
      <div>
        <label htmlFor="">chọn VRMA: </label>
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
      {vrm == undefined ? (
        <div style={{ display: "flex", justifyContent: "center" }}></div>
      ) : (
        <Canvas flat>
          <PerspectiveCamera makeDefault position={[-0.12, 1, 4]} />
          <Avatar vrm={vrm} selectedVRMA={selectedVRMA} />
          <directionalLight />
        </Canvas>
      )}
    </div>
  );
}

/** VRMアバターを表示するコンポーネント */
const Avatar = ({ vrm, selectedVRMA }: { vrm: VRM; selectedVRMA: string }) => {
  const mixer = useRef<THREE.AnimationMixer>();
  const action = useRef<THREE.AnimationAction>();
  const [show, setShow] = useState(false);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }

    if (vrm) {
      vrm.update(delta);
    }
  });

  const vrmaContainer = useLoader(GLTFLoader, selectedVRMA, (loader) => {
    loader.register((parser) => {
      return new VRMAnimationLoaderPlugin(parser);
    });
  });

  // debugger;
  const vrma = (vrmaContainer.userData.vrmAnimations?.[0] ?? undefined) as
    | VRMAnimation
    | undefined;

  useEffect(() => {
    const loadAnimation = async () => {
      if (!vrm) return;
      if (!vrma) return;

      const mixerTmp: THREE.AnimationMixer = new THREE.AnimationMixer(
        vrm.scene
      );
      mixer.current = mixerTmp;

      const clip = createVRMAnimationClip(vrma, vrm);
      action.current = mixer.current.clipAction(clip);
      action.current.play();

      setShow(true);
    };
    loadAnimation();
  }, [vrm, vrma]);

  return show ? <primitive object={vrm.scene}></primitive> : <></>;
};
