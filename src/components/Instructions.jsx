import React from 'react';

function Instructions({ title = "Инструкция", children, iteration = null }) {
  return (
    <div className="instructions">
      <h2>{title}</h2>
      
      {/* Показать инструкции для конкретной итерации, если предоставлены */}
      {iteration && (
        <p>Итерация {iteration}: {getIterationDescription(iteration)}</p>
      )}
      
      {/* Показать пользовательский контент */}
      {children}
    </div>
  );
}

// Вспомогательная функция для получения описания каждой итерации
function getIterationDescription(iteration) {
  switch (iteration) {
    case 0:
      return "базовая настройка сцены";
    case 1:
      return "добавляем 3D бассейн";
    case 2:
      return "добавляем физику и мяч";
    case 3:
      return "интерактивное создание шаров";
    default:
      return "";
  }
}

export default Instructions;