import { Canvas } from "@react-three/fiber";
import { Physics, useSphere, usePlane } from "@react-three/cannon";
import { useCallback, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./App.css";

// CursorBall component is now unused since we're creating balls directly at cursor position
// and they follow the cursor until released
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
      <meshStandardMaterial color="hotpink" opacity={0.5} transparent={true} />
    </mesh>
  );
}

function FallingBall({ position, size, color, isHeld = false }) {
  const [ref] = useSphere(() => ({
    mass: size * 10,
    position,
    args: [size],
    // Disable physics while the ball is being held
    type: isHeld ? "Kinematic" : "Dynamic",
  }));

  // Update position to follow cursor if the ball is being held
  useFrame(({ mouse, viewport }) => {
    if (isHeld && ref.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      ref.current.position.set(x, y, 0);
    }
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[size]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.3}
        roughness={0.2}
        emissive={isHeld ? color : "#000000"} 
        emissiveIntensity={isHeld ? 0.5 : 0}
      />
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
  const [heldBall, setHeldBall] = useState(null);
  const mouseRef = useRef([0, 0, 0]);

  // Create a new ball when mouse is pressed
  useEffect(() => {
    if (isPressed && !heldBall) {
      const size = 0.2 + Math.random() * 0.3;
      const color = new THREE.Color().setHSL(Math.random(), 0.8, 0.6);
      
      setHeldBall({
        key: Math.random(),
        size,
        color: color.getHex(),
        position: mouseRef.current,
        isHeld: true
      });
    }
    
    // Release the ball when mouse is released
    if (!isPressed && heldBall) {
      setBalls(prev => [...prev, { ...heldBall, isHeld: false }]);
      setHeldBall(null);
    }
  }, [isPressed, heldBall]);

  // Track mouse position for initial ball placement
  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    mouseRef.current = [x, y, 0];
  });

  return (
    <>
      {heldBall && <FallingBall {...heldBall} />}
      {balls.map(({ key, ...props }) => (
        <FallingBall key={key} {...props} />
      ))}
      <Ground />
    </>
  );
}

function Instructions() {
  return (
    <div className="instructions">
      <h2>Инструкция</h2>
      <p>Нажмите, чтобы создать шар под курсором</p>
      <p>Перемещайте мышь, чтобы позиционировать шар</p>
      <p>Отпустите кнопку мыши, чтобы бросить шар</p>
      <p>Создавайте много шаров для интересных физических эффектов!</p>
    </div>
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
    <>
      <Instructions />
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
    </>
  );
}
