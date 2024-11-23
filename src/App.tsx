import React from 'react';
import './App.css';
import Model from './vrm';
import { useVRM } from './lib/useVRM';

function App() {

    const vrm  = useVRM("/models/nu2_bo2.vrm").vrm;
    const vrm2  = useVRM("/models/nu2_bo3.vrm").vrm;

  return (
    <div className="App">
      {
        vrm !== null ?  <Model vrm={vrm}></Model>:
       
        <div>Loading...</div>
 

      }
        {
        vrm2 !== null ?  <Model vrm={vrm2}></Model>:
       
        <div>Loading...</div>
 

      }
     
    </div>
  );
}

export default App;
