import React, { useEffect, useLayoutEffect, useState, useRef } from "react";

// for vrm
import * as THREE from "three";
import { VRM } from "@pixiv/three-vrm";
// import { useVRM } from "./lib/useVRM";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  createVRMAnimationClip,
  VRMAnimation,
  VRMAnimationLoaderPlugin,
} from "@pixiv/three-vrm-animation";
import { listVRMS } from "../src/contants";
import { vrmFiles } from "../src/fileVRM";
import { useVRM } from "../src/lib/useVRM";
import TheHeader from "./components/header/TheHeader";
import VrmaNu1 from "./components/nu1/VrmaNu1";

export default function Model() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [selectedVRMA, setSelectedVRMA] = useState<string>(listVRMS[0].value);
  const { vrm } = useVRM(selectedVRMA);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0); // state cho thanh tiến trình

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

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (loading) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 65) {
            return prevProgress + 1; // Tăng dần thanh tiến trình
          } else {
            clearInterval(interval!);
            return prevProgress;
          }
        });
      }, 100); // Tăng mỗi 100ms (điều chỉnh thời gian)
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVRMA(event.target.value);
    setLoading(true);
    setProgress(0); // Reset lại thanh tiến trình khi chọn VRMA mới
  };

  return (
    //   //
    <div></div>

    //   <div style={{ backgroundColor: "#f4f4f4" }}>
    //     <div className="container">
    //       <div className="row">
    //         <div>
    //           <h2>Chọn VRM</h2>
    //           <select
    //             name="select-vrm"
    //             id="select-vrm"
    //             value={selectedVRMA}
    //             onChange={handleChange}
    //           >
    //             <option value="Chọn vrm">CHọn vrm</option>
    //             {vrmFiles.map((file, index) => (
    //               <option key={index} value={file.value}>
    //                 {file.name}
    //               </option>
    //             ))}
    //           </select>
    //         </div>

    //         <div className="col-8 ">
    //           <div className="row d-flex">
    //             {listVRMS.map((listVRMS, index) => (
    //               <div key={index} className="col-4">
    //                 <img
    //                   src={listVRMS.image}
    //                   alt={listVRMS.name}
    //                   style={{
    //                     width: "270px",
    //                     height: "260px",
    //                     margin: "10px",
    //                     cursor: "pointer",
    //                     border:
    //                       selectedVRMA === listVRMS.value
    //                         ? "2px solid blue"
    //                         : "none",
    //                   }}
    //                   onClick={() => {
    //                     setSelectedVRMA(listVRMS.value);
    //                   }}
    //                 />
    //                 <p>{listVRMS.name}</p>
    //               </div>
    //             ))}
    //           </div>
    //         </div>
    //     <div className="col-4 ">
    //       <div>
    //         <label htmlFor="">chọn VRMA: </label>
    //         <select
    //           name="select-vrma"
    //           id="select-vrma"
    //           value={selectedVRMA}
    //           onChange={handleChange}
    //         >
    //           {listVRMS.map((fileVRMA, index) => (
    //             <option key={index} value={fileVRMA.value}>
    //               {fileVRMA.name}
    //             </option>
    //           ))}
    //         </select>
    //       </div>
    //       {/* {loading ? (
    //       <div style={loadingContainer}>
    //         <p style={loadingText}>Loading VRM...</p>
    //         <div style={progressBarContainer}>
    //           <div
    //             style={{
    //               ...progressBar,
    //               width: `${progress}%`,
    //             }}
    //           ></div>
    //         </div>
    //       </div>
    //     ) : null} */}
    //       {vrm == undefined ? (
    //         <div></div>
    //       ) : (
    //         <Canvas
    //           flat
    //           style={{
    //             width: "100%",
    //             height: "500px",
    //             backgroundColor: "#ccc",
    //           }}
    //         >
    //           <PerspectiveCamera makeDefault position={[-0.12, 1, 4]} />
    //           <Avatar
    //             vrm={vrm}
    //             selectedVRMA={selectedVRMA}
    //             setLoading={setLoading}
    //           />
    //           <OrbitControls />
    //           <directionalLight />
    //         </Canvas>
    //       )}
    //     </div>
    //   </div>
    // </div>
    //   </div>
  );
}

/** VRMアバターを表示するコンポーネント */
const Avatar = ({
  vrm,
  selectedVRMA,
  setLoading,
}: {
  vrm: VRM;
  selectedVRMA: string;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
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
      setLoading(false); // cập nhật lại khi load vrma tải xong
    };
    loadAnimation();
  }, [vrm, vrma, setLoading]);

  return show ? <primitive object={vrm.scene}></primitive> : <></>;
};
// const loadingContainer: React.CSSProperties = {
//   position: "absolute",
//   top: "70%",
//   left: "50%",
//   transform: "translate(-50%, -50%)",
//   textAlign: "center",
//   fontSize: "24px",
//   zIndex: 10,
// };

// const loadingText: React.CSSProperties = {
//   marginBottom: "10px",
// };

// const progressBarContainer: React.CSSProperties = {
//   width: "210px",
//   height: "5px",
//   backgroundColor: "#e2e2f2",
//   borderRadius: "5px",
//   marginTop: "10px",
// };

// const progressBar: React.CSSProperties = {
//   height: "100%",
//   backgroundColor: "blue",
//   borderRadius: "5px",
// };
