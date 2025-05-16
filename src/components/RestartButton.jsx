import React, { useState } from 'react';

// Компонент кнопки перезапуска
function RestartButton({ onRestart }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const buttonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    padding: '10px 15px',
    backgroundColor: isHovered ? 'rgba(79, 195, 247, 0.8)' : 'rgba(79, 195, 247, 0.6)',
    color: 'white',
    border: '2px solid rgba(255, 255, 255, 0.5)',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    zIndex: 20,
    boxShadow: isHovered 
      ? '0 0 15px rgba(79, 195, 247, 0.9), 0 0 5px rgba(255, 255, 255, 0.5)' 
      : '0 0 10px rgba(79, 195, 247, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
  };

  return (
    <button
      style={buttonStyle}
      onClick={onRestart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Перезапуск
    </button>
  );
}

export default RestartButton;