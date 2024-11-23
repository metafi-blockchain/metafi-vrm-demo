import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from "three";

export function useVRM(selectedVRMA: string): {
  vrm: VRM | null;
  fetchedSize: number;
} {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [fetchedSize, setFetchedSize] = useState<number>(0);
  const refVRM = useRef<VRM | null>(null);

  useEffect(() => {
    const fetchModel = async () => {
      const vrmUrl = "./models/nu1.vrm";
      // ./models/nu2_bo1.vrm
      // ./models/nu2_bo2.vrm
      // ./models/nu2_bo3.vrm

      // const vrmUrl = URL.createObjectURL(modelBlob);
      const loader = new GLTFLoader();
      loader.register((parser) => new VRMLoaderPlugin(parser));

      loader.load(
        selectedVRMA,
        (gltf) => {
          // xóa vrm cũ
          const prevVRM = refVRM.current;
          if (prevVRM) {
            VRMUtils.deepDispose(prevVRM.scene);
          }

          if (!gltf.userData.vrm) {
            return;
          }

          const vrm = gltf.userData.vrm as VRM;
          vrm.scene.traverse((obj) => {
            obj.frustumCulled = false;
            if ((obj as THREE.Mesh).isMesh) {
              obj.castShadow = true;
            }
          });

          VRMUtils.rotateVRM0(vrm);

          // Set VRM
          setVrm(vrm);
          refVRM.current = vrm;
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
          setFetchedSize(xhr.loaded);
        },
        (error) => {
          console.error("An error happened while loading VRM");
          console.error(error);
        }
      );
    };
    fetchModel();
  }, []);

  return { vrm, fetchedSize };
}
