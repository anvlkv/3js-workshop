import React, { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import Scene from './components/Scene';
import Instructions from './components/Instructions';
import RestartButton from './components/RestartButton';
import './App.css';

function Loader() {
  return (
    <div className="loader">
      <p>Загрузка...</p>
    </div>
  );
}

function App() {
  const [restartCount, setRestartCount] = useState(0);
  
  const handleRestart = useCallback(() => {
    // Увеличиваем счетчик перезапуска
    setRestartCount(prev => prev + 1);
    
    // Вызываем глобальную функцию перезапуска, если она доступна
    if (window.__restartSpaceship) {
      window.__restartSpaceship();
    }
  }, []);
  
  return (
    <div className="app-container">
      <div className="canvas-container">
        <Suspense fallback={<Loader />}>
          <Canvas camera={{ position: [0, 5, 10], fov: 45 }}>
            <color attach="background" args={['#000010']} />
            <Scene key={restartCount} />
          </Canvas>
        </Suspense>
      </div>
      <div className="header">
        <h1>Полет в космос</h1>
        <p>Добро пожаловать в воркшоп по Three.js</p>
      </div>
      <RestartButton onRestart={handleRestart} />
      <Instructions />
    </div>
  );
}

export default App;