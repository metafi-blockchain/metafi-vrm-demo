import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';


// for vrm
import * as THREE from 'three';
import { VRM } from '@pixiv/three-vrm';
import { useVRM } from './lib/useVRM';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { createVRMAnimationClip, VRMAnimation, VRMAnimationLoaderPlugin } from '@pixiv/three-vrm-animation';

export default function Model() {


  const rootRef = useRef<HTMLDivElement | null>(null);
  const { vrm } = useVRM();



  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const resizeCanvas = () => {
      root.style.width = `${document.documentElement.clientWidth}px`;
      root.style.height = `${document.documentElement.clientHeight}px`;
    };
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div ref={rootRef}>
      {vrm == undefined ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
          </div>

      ) : (
        <Canvas flat>
          <PerspectiveCamera makeDefault position={[-0.12, 1, 4]} />
          <Avatar vrm={vrm} />
          <directionalLight />
        </Canvas>
      )}


    </div>
  );
}

/** VRMアバターを表示するコンポーネント */
const Avatar = ({ vrm }: { vrm: VRM }) => {
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

  const vrmaContainer = useLoader(GLTFLoader, '/vrmas/VRMA_07.vrma', (loader) => {
    loader.register((parser) => {
      return new VRMAnimationLoaderPlugin(parser);
    });
  });

  debugger
  const vrma = (vrmaContainer.userData.vrmAnimations?.[0] ?? undefined) as VRMAnimation | undefined;

  useEffect(() => {
    const loadAnimation = async () => {
      if (!vrm) return;
      if (!vrma) return;

      const mixerTmp: THREE.AnimationMixer = new THREE.AnimationMixer(vrm.scene);
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

