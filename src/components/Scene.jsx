import React, { useState } from 'react';
import { Stars, OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import Planet from './Planet';
import Spaceship from './Spaceship';

// Компонент сцены с физикой и освещением
function Scene() {
  // Счетчик перезапусков для сброса состояния корабля
  const [restartCounter, setRestartCounter] = useState(0);
  
  // Функция для перезапуска корабля
  const handleRestart = () => {
    setRestartCounter(prev => prev + 1);
  };
  
  return (
    <>
      {/* Освещение */}
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Физика без гравитации (гравитация реализована в компоненте корабля) */}
      <Physics gravity={[0, 0, 0]}>
        <Planet position={[0, 0, 0]} />
        <Spaceship position={[0, 2.5, 0]} restartKey={restartCounter} />
      </Physics>
      
      {/* Звезды на заднем плане */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0.5} fade />
      
      {/* Управление камерой */}
      <OrbitControls makeDefault enablePan={false} minDistance={5} maxDistance={20} />
      
      {/* Передаем колбэк в потомка через портал, чтобы обойти ограничения R3F */}
      <RestartHandler onRestart={handleRestart} />
    </>
  );
}

// Компонент для работы с HTML событиями из 3D-сцены
function RestartHandler({ onRestart }) {
  // Добавляем обработчик клавиши R для перезапуска
  React.useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        onRestart();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    
    // Сохраняем ссылку на функцию перезапуска для доступа из внешнего кода
    window.__restartSpaceship = onRestart;
    
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      delete window.__restartSpaceship;
    };
  }, [onRestart]);
  
  return null;
}

export default Scene;