import React, { useRef } from 'react';
import { useLoader, useFrame } from '@react-three/fiber';
import { useSphere } from '@react-three/cannon';
import { TextureLoader } from 'three';
import venusTexture from '../assets/2k_venus_surface.jpg';

function Planet({ position = [0, 0, 0], radius = 2 }) {
  const planetRef = useRef();
  const texture = useLoader(TextureLoader, venusTexture);
  
  // Физика планеты (статическое тело)
  const [planetPhysicsRef, planetApi] = useSphere(() => ({
    args: [radius], // Радиус планеты
    mass: 0, // Планета неподвижна (бесконечная масса)
    position,
    type: 'Static',
  }));
  
  // Вращение планеты
  useFrame((state, delta) => {
    planetRef.current.rotation.y += delta * 0.1;
  });
  
  return (
    <mesh ref={planetRef} position={position}>
      <mesh ref={planetPhysicsRef} visible={false} />
      <sphereGeometry args={[radius, 64, 64]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

export default Planet;