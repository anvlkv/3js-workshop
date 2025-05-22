import React from "react";
import { Canvas } from "@react-three/fiber";
import Instructions from "./components/Instructions";
import Lighting from "./components/Lighting";
import Environment from "./components/Environment";
import Pool from "./components/Pool";
import "./App.css";

export default function App() {
  return (
    <>
      <Instructions iteration={1}>
        <p>Мы создали дно и стены бассейна</p>
        <p>Далее добавим физику и мячи</p>
      </Instructions>
      
      <Canvas 
        camera={{ position: [0, 3, 12], fov: 50 }}
        shadows
      >
        {/* Освещение */}
        <Lighting enableShadows={true} />
        
        {/* Фон сцены */}
        <Environment />

        {/* Бассейн без физики */}
        <Pool usePhysics={false} />
      </Canvas>
    </>
  );
}