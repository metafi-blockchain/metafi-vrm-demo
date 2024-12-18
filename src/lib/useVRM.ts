import { VRM, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import { useEffect, useRef, useState } from 'react';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';



export function useVRM(vrmURI: string): {
  /** vrm本体　 */
  vrm: VRM | null;
  fetchedSize: number;
} {

  const [vrm, setVrm] = useState<VRM | null>(null);
  const [fetchedSize, setFetchedSize] = useState<number>(0);
  const refVRM = useRef<VRM>();
  // const [vrmURI, setVrmURI] = useState<string>('./models/nu2_bo1.vrm');

  useEffect(() => {

    const fetchModel = async (vrmUrl: string) => {
      

      // const vrmUrl = URL.createObjectURL(modelBlob);
      const loader = new GLTFLoader();
      loader.register((parser) => {
        return new VRMLoaderPlugin(parser);
      });

      loader.load(
        vrmUrl,
        (gltf) => {
          // dispose previous VRM
          const prevVRM = refVRM.current;
          if (prevVRM) {
            VRMUtils.deepDispose(prevVRM.scene);
            setVrm(null);
            setFetchedSize(0);
          }

          // prepare vrm
          const vrm = gltf.userData.vrm as VRM;

          vrm.scene.traverse((obj) => {
            obj.frustumCulled = false;
            if ((obj as THREE.Mesh).isMesh) {
              obj.castShadow = true;
            }
          });

          VRMUtils.rotateVRM0(vrm);

          // set VRM
          setVrm(vrm);
          refVRM.current = vrm;
        },
        (xhr) => console.log((xhr.loaded / xhr.total) * 100 + '% loaded'),
        (error) => {
          console.error('An error happened');
          console.error(error);
        },
      );
    };
    fetchModel(vrmURI);

  }, [vrmURI]);

  return { vrm: vrm, fetchedSize: fetchedSize };
}
