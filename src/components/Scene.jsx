import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import Ball from './Ball';

function Scene({ isPressed, pressTime, usePhysics = false }) {
  const [balls, setBalls] = useState([]);
  const [heldBall, setHeldBall] = useState(null);
  const mouseRef = useRef([0, 0, 0]);

  // Создаем новый шар при нажатии мыши
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
        usePhysics,
      });
    }

    // Отпускаем шар, когда кнопка мыши отпущена
    if (!isPressed && heldBall) {
      setBalls((prev) => [...prev, { ...heldBall, isHeld: false }]);
      setHeldBall(null);
    }
  }, [isPressed, heldBall, usePhysics]);

  // Отслеживаем позицию мыши для начального размещения шара
  useFrame(({ mouse, viewport }) => {
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    mouseRef.current = [x, y, 0];
  });

  return (
    <>
      {heldBall && <Ball {...heldBall} />}
      {balls.map(({ key, ...props }) => (
        <Ball key={key} {...props} />
      ))}
    </>
  );
}

export default Scene;