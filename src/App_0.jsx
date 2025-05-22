import React from "react";
import { Canvas } from "@react-three/fiber";
import Instructions from "./components/Instructions";
import Lighting from "./components/Lighting";
import Environment from "./components/Environment";
import "./App.css";

export default function App() {
  return (
    <>
      <Instructions iteration={0}>
        <p>Это наша первая итерация 3D сцены</p>
        <p>Мы начинаем с пустой сцены и базового освещения</p>
      </Instructions>
      
      <Canvas camera={{ position: [0, 3, 12], fov: 50 }}>
        {/* Базовое освещение */}
        <Lighting enableShadows={false} />
        
        {/* Фон сцены */}
        <Environment />
      </Canvas>
    </>
  );
}