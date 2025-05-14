import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import './App.css';

function Planet() {
  const planetRef = useRef();
  
  useFrame((state, delta) => {
    // Вращение планеты вокруг своей оси
    planetRef.current.rotation.y += delta * 0.1;
  });
  
  return (
    <mesh ref={planetRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial color="#3080ff" />
    </mesh>
  );
}

function App() {
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={['#000010']} />
          <ambientLight intensity={0.2} />
          <directionalLight position={[5, 3, 5]} intensity={1} />
          <Planet />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
          <OrbitControls />
        </Canvas>
      </div>
      <div className="header">
        <h1>Полет в космос</h1>
        <p>Добро пожаловать в воркшоп по Three.js</p>
      </div>
    </div>
  );
}

export default App;