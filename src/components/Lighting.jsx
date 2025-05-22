import React from 'react';

function Lighting({ 
  ambientIntensity = 0.3,
  directionalIntensity = 1,
  directionalPosition = [10, 10, 5],
  enableShadows = true,
  pointLight1Intensity = 0.8, 
  pointLight1Position = [-5, 5, 5], 
  pointLight1Color = "#ff9000",
  pointLight2Intensity = 0.5,
  pointLight2Position = [5, 8, -5],
  pointLight2Color = "#4080ff"
}) {
  return (
    <>
      {/* Фоновый свет - мягкое общее освещение */}
      <ambientLight intensity={ambientIntensity} />
      
      {/* Направленный свет - основной источник света с тенями */}
      <directionalLight
        position={directionalPosition}
        intensity={directionalIntensity}
        castShadow={enableShadows}
        shadow-mapSize={enableShadows ? [2048, 2048] : undefined}
      />
      
      {/* Цветные точечные источники света для атмосферы */}
      <pointLight 
        position={pointLight1Position} 
        intensity={pointLight1Intensity} 
        color={pointLight1Color} 
      />
      <pointLight 
        position={pointLight2Position} 
        intensity={pointLight2Intensity} 
        color={pointLight2Color} 
      />
    </>
  );
}

export default Lighting;