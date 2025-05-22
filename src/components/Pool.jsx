import React from 'react';
import { usePlane, useBox } from '@react-three/cannon';

function Pool({ usePhysics = false }) {
  const poolSize = 8; // Размер бассейна
  const wallThickness = 0.5;
  const wallHeight = 2;

  // Условно используем физические хуки или создаем стандартные меши
  const getFloorProps = () => {
    if (usePhysics) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [ref] = usePlane(() => ({
        rotation: [-Math.PI / 2, 0, 0],
        position: [0, -5, 0],
        type: "Static",
        material: { restitution: 0.5 }, // Делаем пол слегка упругим
      }));
      return { ref };
    }
    return { position: [0, -5, 0], rotation: [-Math.PI / 2, 0, 0] };
  };

  const getWallProps = (position) => {
    if (usePhysics) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [ref] = useBox(() => ({
        position,
        args: position[2] === 0 
          ? [wallThickness, wallHeight, poolSize] 
          : [poolSize, wallHeight, wallThickness],
        type: "Static",
        material: { restitution: 0.7 }, // Делаем стены более упругими
      }));
      return { ref };
    }
    return { position };
  };

  // Рассчитываем позиции стен
  const leftWallPosition = [-poolSize / 2 - wallThickness / 2, -5 + wallHeight / 2, 0];
  const rightWallPosition = [poolSize / 2 + wallThickness / 2, -5 + wallHeight / 2, 0];
  const backWallPosition = [0, -5 + wallHeight / 2, -poolSize / 2 - wallThickness / 2];
  const frontWallPosition = [0, -5 + wallHeight / 2, poolSize / 2 + wallThickness / 2];

  // Получаем пропсы для каждого элемента
  const floorProps = getFloorProps();
  const leftWallProps = getWallProps(leftWallPosition);
  const rightWallProps = getWallProps(rightWallPosition);
  const backWallProps = getWallProps(backWallPosition);
  const frontWallProps = getWallProps(frontWallPosition);

  return (
    <>
      {/* Пол */}
      <mesh {...floorProps} receiveShadow>
        <planeGeometry args={[poolSize, poolSize]} />
        <meshStandardMaterial color="#303045" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Левая стена */}
      <mesh {...leftWallProps} receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, poolSize]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Правая стена */}
      <mesh {...rightWallProps} receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, poolSize]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Задняя стена */}
      <mesh {...backWallProps} receiveShadow>
        <boxGeometry args={[poolSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Передняя стена */}
      <mesh {...frontWallProps} receiveShadow>
        <boxGeometry args={[poolSize, wallHeight, wallThickness]} />
        <meshStandardMaterial color="#404060" roughness={0.5} metalness={0.3} />
      </mesh>
    </>
  );
}

export default Pool;