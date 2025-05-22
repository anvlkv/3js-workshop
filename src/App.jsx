import { Canvas } from "@react-three/fiber";
import { Physics, useSphere, usePlane, useBox } from "@react-three/cannon";
import { useCallback, useEffect, useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import "./App.css";

function FallingBall({ position, size, color, isHeld = false }) {
  const [ref] = useSphere(() => ({
    mass: size * 10,
    position,
    args: [size],
    // Disable physics while the ball is being held
    type: isHeld ? "Kinematic" : "Dynamic",
    // Make balls bouncy
    restitution: 0.8,
    linearDamping: 0.1,
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
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={color}
        metalness={0.5}
        roughness={0.1}
        emissive={isHeld ? color : "#000000"}
        emissiveIntensity={isHeld ? 0.5 : 0}
      />
    </mesh>
  );
}

// Pool component with floor and walls
function Pool() {
  const poolSize = 8; // Size of the pool
  const wallThickness = 0.5;
  const wallHeight = 2;

  // Floor
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, -5, 0],
    type: "Static",
    material: { restitution: 0.5 }, // Make the floor slightly bouncy
  }));

  // Walls - using useBox for each wall
  const [leftWallRef] = useBox(() => ({
    position: [-poolSize / 2 - wallThickness / 2, -5 + wallHeight / 2, 0],
    args: [wallThickness, wallHeight, poolSize],
    type: "Static",
    material: { restitution: 0.7 }, // Make walls bouncier
  }));

  const [rightWallRef] = useBox(() => ({
    position: [poolSize / 2 + wallThickness / 2, -5 + wallHeight / 2, 0],
    args: [wallThickness, wallHeight, poolSize],
    type: "Static",
    material: { restitution: 0.7 },
  }));

  const [backWallRef] = useBox(() => ({
    position: [0, -5 + wallHeight / 2, -poolSize / 2 - wallThickness / 2],
    args: [poolSize, wallHeight, wallThickness],
    type: "Static",
    material: { restitution: 0.7 },
  }));

  const [frontWallRef] = useBox(() => ({
    position: [0, -5 + wallHeight / 2, poolSize / 2 + wallThickness / 2],
    args: [poolSize, wallHeight, wallThickness],
    type: "Static",
    material: { restitution: 0.7 },
  }));

  return (
    <>
      {/* Floor */}
      <mesh ref={floorRef} receiveShadow>
        <planeGeometry args={[poolSize, poolSize]} />
        <meshStandardMaterial color="#303045" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Left wall */}
      <mesh ref={leftWallRef} receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, poolSize]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Right wall */}
      <mesh ref={rightWallRef} receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, poolSize]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Back wall */}
      <mesh ref={backWallRef} receiveShadow>
        <boxGeometry args={[poolSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Front wall */}
      <mesh ref={frontWallRef} receiveShadow>
        <boxGeometry args={[poolSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#404060" roughness={0.5} metalness={0.3} />
      </mesh>
    </>
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
        isHeld: true,
      });
    }

    // Release the ball when mouse is released
    if (!isPressed && heldBall) {
      setBalls((prev) => [...prev, { ...heldBall, isHeld: false }]);
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
      <Pool />
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
      <p>Шары будут отскакивать от стен бассейна!</p>
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
        camera={{ position: [0, 3, 12], fov: 50 }}
        shadows
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        {/* Improved lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        <pointLight position={[-5, 5, 5]} intensity={0.8} color="#ff9000" />
        <pointLight position={[5, 8, -5]} intensity={0.5} color="#4080ff" />

        {/* Background environment */}
        <color attach="background" args={["#121218"]} />
        <fog attach="fog" args={["#121218", 15, 25]} />

        <Physics gravity={[0, -9.81, 0]}>
          <Scene isPressed={isPressed} pressTime={pressTime} />
        </Physics>
      </Canvas>
    </>
  );
}
