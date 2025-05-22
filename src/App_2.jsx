import React from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import Instructions from "./components/Instructions";
import Lighting from "./components/Lighting";
import Environment from "./components/Environment";
import Pool from "./components/Pool";
import Ball from "./components/Ball";
import "./App.css";

export default function App() {
  return (
    <>
      <Instructions iteration={2}>
        <p>Мяч падает в бассейн и отскакивает от стен</p>
        <p>Мы используем физический движок для симуляции гравитации и столкновений</p>
      </Instructions>
      
      <Canvas 
        camera={{ position: [0, 3, 12], fov: 50 }}
        shadows
      >
        {/* Освещение */}
        <Lighting enableShadows={true} />
        
        {/* Фон сцены */}
        <Environment />

        {/* Физика и объекты */}
        <Physics gravity={[0, -9.81, 0]}>
          <Pool usePhysics={true} />
          <Ball 
            position={[0, 2, 0]} 
            size={0.5} 
            color="#ff6600" 
            usePhysics={true} 
          />
        </Physics>
      </Canvas>
    </>
  );
}