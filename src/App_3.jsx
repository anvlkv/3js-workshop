import React, { useState, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import Instructions from "./components/Instructions";
import Lighting from "./components/Lighting";
import Environment from "./components/Environment";
import Pool from "./components/Pool";
import Scene from "./components/Scene";
import "./App.css";

export default function App() {
  const [isPressed, setIsPressed] = useState(false);
  const pressTime = useRef(0);

  const handleMouseDown = useCallback(() => {
    setIsPressed(true);
    pressTime.current = Date.now();
  }, []);

  const handleMouseUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <>
      <Instructions iteration={3}>
        <p>Нажмите, чтобы создать шар под курсором</p>
        <p>Перемещайте мышь, чтобы позиционировать шар</p>
        <p>Отпустите кнопку мыши, чтобы бросить шар</p>
        <p>Создавайте много шаров для интересных физических эффектов!</p>
        <p>Шары будут отскакивать от стен бассейна!</p>
      </Instructions>
      
      <Canvas
        camera={{ position: [0, 3, 12], fov: 50 }}
        shadows
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Освещение */}
        <Lighting enableShadows={true} />
        
        {/* Фон сцены */}
        <Environment />

        <Physics gravity={[0, -9.81, 0]}>
          <Pool usePhysics={true} />
          <Scene 
            isPressed={isPressed} 
            pressTime={pressTime}
            usePhysics={true}
          />
        </Physics>
      </Canvas>
    </>
  );
}