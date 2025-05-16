import React, { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { Text } from "@react-three/drei";

// Компонент космического корабля (ракеты)
function Spaceship({ position = [0, 2.5, 0], restartKey = 0 }) {
  const initialPosition = [...position]; // Запоминаем начальную позицию
  
  // Физика корабля
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: initialPosition,
    args: [0.5, 1.2, 0.5], // Размеры коллайдера
    linearDamping: 0.1, // Замедление для более реалистичного движения
  }));

  // Отслеживание скорости
  const [velocity, setVelocity] = useState([0, 0, 0]);

  // Эффект для перезапуска позиции корабля
  useEffect(() => {
    if (restartKey > 0) {
      // Сбрасываем позицию и скорость
      api.position.set(...initialPosition);
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
      api.rotation.set(0, 0, 0);
    }
  }, [restartKey, api, initialPosition]);

  // Подписка на изменения скорости
  useEffect(() => {
    const unsubscribe = api.velocity.subscribe((v) => setVelocity(v));
    return unsubscribe;
  }, [api.velocity]);

  // Управление кораблем с клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      const force = 4; // Сила импульса

      switch (e.key) {
        case "ArrowUp": // Вверх
          api.applyImpulse([0, force, 0], [0, 0, 0]);
          break;
        case "ArrowDown": // Вниз
          api.applyImpulse([0, -force, 0], [0, 0, 0]);
          break;
        case "ArrowLeft": // Влево
          api.applyImpulse([-force, 0, 0], [0, 0, 0]);
          break;
        case "ArrowRight": // Вправо
          api.applyImpulse([force, 0, 0], [0, 0, 0]);
          break;
        case "w": // Вперед
        case "W":
          api.applyImpulse([0, 0, -force], [0, 0, 0]);
          break;
        case "s": // Назад
        case "S":
          api.applyImpulse([0, 0, force], [0, 0, 0]);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [api]);

  // Гравитационное притяжение к планете
  useFrame(() => {
    if (!ref.current) return;

    const position = ref.current.position;
    const distanceToCenter = Math.sqrt(
      position.x ** 2 + position.y ** 2 + position.z ** 2
    );

    if (distanceToCenter > 2.1) {
      // Если корабль не на поверхности
      const gravityForce = 5 / (distanceToCenter * distanceToCenter); // Сила гравитации
      const forceX = (-position.x / distanceToCenter) * gravityForce;
      const forceY = (-position.y / distanceToCenter) * gravityForce;
      const forceZ = (-position.z / distanceToCenter) * gravityForce;

      api.applyForce([forceX, forceY, forceZ], [0, 0, 0]);
    }
  });

  // Расчет скорости для отображения
  const currentSpeed = Math.sqrt(
    velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2
  ).toFixed(2);

  return (
    <>
      <group ref={ref}>
        {/* Основной корпус ракеты (цилиндр) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
          <meshStandardMaterial
            color="#d8d8d8"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>

        {/* Носовой конус */}
        <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
          <coneGeometry args={[0.2, 0.4, 16]} />
          <meshStandardMaterial
            color="#c0c0c0"
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>

        {/* Кабина */}
        <mesh position={[0, 0.2, 0.15]}>
          <sphereGeometry
            args={[0.15, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
          />
          <meshStandardMaterial color="#88aaff" transparent opacity={0.7} />
        </mesh>

        {/* Стабилизаторы (крылья) */}
        <mesh position={[0.22, -0.3, 0]} rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#a0a0a0" />
        </mesh>
        <mesh position={[-0.22, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#a0a0a0" />
        </mesh>
        <mesh position={[0, -0.3, 0.22]} rotation={[0, -Math.PI / 2, 0]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#a0a0a0" />
        </mesh>
        <mesh position={[0, -0.3, -0.22]} rotation={[0, Math.PI / 2, 0]}>
          <coneGeometry args={[0.15, 0.4, 4]} />
          <meshStandardMaterial color="#a0a0a0" />
        </mesh>

        {/* Сопло двигателя */}
        <mesh position={[0, -0.6, 0]} rotation={[Math.PI, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.2, 16]} />
          <meshStandardMaterial color="#505050" />
        </mesh>

        {/* Огонь из двигателя */}
        <mesh position={[0, -0.8, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.1, 0.4, 16]} />
          <meshStandardMaterial
            color="#ff4400"
            emissive="#ff8800"
            emissiveIntensity={2}
          />
        </mesh>
      </group>

      {/* Информация о скорости */}
      <Text
        position={[0, 1.2, 0]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        renderOrder={1}
        followCamera
      >
        {`Скорость: ${currentSpeed} м/с`}
      </Text>
    </>
  );
}

export default Spaceship;