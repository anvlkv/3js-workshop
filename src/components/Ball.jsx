import React from 'react';
import { useSphere } from '@react-three/cannon';
import { useFrame } from '@react-three/fiber';

function Ball({ 
  position = [0, 2, 0], 
  size = 0.5, 
  color = "#ff6600", 
  isHeld = false,
  usePhysics = false,
  mass = null
}) {
  // Рассчитываем массу на основе размера, если она не указана
  const ballMass = mass !== null ? mass : size * 10;
  
  const getSphereProps = () => {
    if (usePhysics) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [ref] = useSphere(() => ({
        mass: ballMass,
        position,
        args: [size],
        // Отключаем физику, пока шар удерживается
        type: isHeld ? "Kinematic" : "Dynamic",
        // Делаем шары упругими
        restitution: 0.8,
        linearDamping: 0.1,
      }));
      return { ref };
    }
    return { position };
  };
  
  const sphereProps = getSphereProps();
  const meshRef = sphereProps.ref;
  
  // Обновляем позицию, чтобы следовать за курсором, если шар удерживается
  // eslint-disable-next-line react-hooks/rules-of-hooks
  usePhysics && isHeld && useFrame(({ mouse, viewport }) => {
    if (meshRef && meshRef.current) {
      const x = (mouse.x * viewport.width) / 2;
      const y = (mouse.y * viewport.height) / 2;
      meshRef.current.position.set(x, y, 0);
    }
  });

  return (
    <mesh {...sphereProps} castShadow receiveShadow>
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

export default Ball;