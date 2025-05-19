import { Canvas } from "@react-three/fiber";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import { useCallback, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CursorBall({ position }) {
  const [ref] = useSphere(() => ({
    mass: 0,
    position: [0, 0, 0],
    args: [0.2],
  }));

  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    ref.current.position.set(x, y, 0);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.2]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  );
}

function FallingBall({ position, size, color }) {
  const [ref] = useSphere(() => ({
    mass: size * 10,
    position,
    args: [size],
  }));

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function Ground() {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -5, 0],
  }));

  return (
    <mesh ref={ref}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#303030" />
    </mesh>
  );
}

function Scene({ isPressed, pressTime }) {
  const [balls, setBalls] = useState([]);

  useFrame(() => {
    if (isPressed && Date.now() - pressTime.current > 100) {
      const size = 0.2 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
      setBalls((prev) => [
        ...prev,
        {
          key: Math.random(),
          size,
          color: color.getHex(),
          position: [Math.random() * 2 - 1, 5, 0],
        },
      ]);
      pressTime.current = Date.now();
    }
  });

  return (
    <>
      <CursorBall />
      {balls.map(({ key, ...props }) => (
        <FallingBall key={key} {...props} />
      ))}
      <Ground />
    </>
  );
}

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
    <Canvas
      camera={{ position: [0, 0, 10], fov: 50 }}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      <Physics gravity={[0, -9.81, 0]}>
        <Scene isPressed={isPressed} pressTime={pressTime} />
      </Physics>
    </Canvas>
  );
}
