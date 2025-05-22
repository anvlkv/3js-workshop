import React from 'react';

function Environment({ 
  backgroundColor = "#121218", 
  fogColor = "#121218", 
  fogNear = 15, 
  fogFar = 25 
}) {
  return (
    <>
      {/* Цвет фона */}
      <color attach="background" args={[backgroundColor]} />
      
      {/* Туман - создает эффект глубины и расстояния */}
      <fog attach="fog" args={[fogColor, fogNear, fogFar]} />
    </>
  );
}

export default Environment;