# Падающие шары: Добавляем физику и движение 🔴🔵

## Что такое физика в 3D мире?

Физика в 3D мире - это набор правил, которые заставляют объекты двигаться реалистично. В нашем проекте шары будут падать, сталкиваться со стенками бассейна и отскакивать - совсем как в реальном мире!

## Создание падающего шара

Шар - это объект, который будет подчиняться законам физики:
- Падать под действием гравитации
- Отскакивать от стенок и дна бассейна
- Сталкиваться с другими шарами

## Как добавить физику к шару?

Мы используем библиотеку React Three Cannon для добавления физики:

```javascript
function FallingBall({ position, size, color }) {
  // useSphere создает физическое тело в форме шара
  const [ref] = useSphere(() => ({
    mass: size * 10, // Масса шара (тяжелее = сильнее падает)
    position, // Начальное положение
    args: [size], // Размер шара
    restitution: 0.8, // Упругость (насколько хорошо отскакивает)
    linearDamping: 0.1 // Сопротивление воздуха
  }));

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.5} 
        roughness={0.1} 
      />
    </mesh>
  );
}
```

## Что означают параметры физики?

- **mass** - масса шара. Чем больше масса, тем тяжелее шар
- **restitution** - упругость. Значение 1 означает, что шар отскакивает с той же скоростью, с которой ударился
- **linearDamping** - торможение. Как быстро шар замедляется при движении

## Создание нескольких шаров

Мы можем создать много шаров, используя массив и метод map:

```javascript
function Scene() {
  // Массив с данными для каждого шара
  const balls = [
    { id: 1, position: [0, 5, 0], size: 0.5, color: "#ff0000" },
    { id: 2, position: [1, 7, 0], size: 0.7, color: "#00ff00" },
    { id: 3, position: [-1, 6, 0], size: 0.3, color: "#0000ff" }
  ];

  return (
    <>
      {/* Создаем шар для каждого элемента массива */}
      {balls.map(ball => (
        <FallingBall 
          key={ball.id}
          position={ball.position}
          size={ball.size}
          color={ball.color}
        />
      ))}
      <Pool />
    </>
  );
}
```

## Интерактивное создание шаров

Самое интересное - создавать шары с помощью мыши!

```javascript
function Scene() {
  // Состояние для хранения созданных шаров
  const [balls, setBalls] = useState([]);
  
  // Функция для создания нового шара
  function createBall(x, y) {
    const newBall = {
      id: Math.random(), // Уникальный идентификатор
      position: [x, 5, 0], // Положение (x из мыши, y - высоко)
      size: 0.2 + Math.random() * 0.3, // Случайный размер
      color: `hsl(${Math.random() * 360}, 80%, 60%)` // Случайный цвет
    };
    
    // Добавляем новый шар в массив шаров
    setBalls([...balls, newBall]);
  }
  
  // Обработчик клика мыши
  function handleClick(event) {
    // Вычисляем координаты в 3D пространстве из координат мыши
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    createBall(x * 5, y * 5); // Создаем шар
  }
  
  return (
    <Canvas onClick={handleClick}>
      {/* Отображаем все созданные шары */}
      {balls.map(ball => (
        <FallingBall key={ball.id} {...ball} />
      ))}
      <Pool />
    </Canvas>
  );
}
```

## Улучшение взаимодействия с шарами

Мы можем добавить возможность "держать" шар, перемещать его и затем отпускать:

```javascript
function App() {
  const [isPressed, setIsPressed] = useState(false);
  const [heldBall, setHeldBall] = useState(null);
  
  function handleMouseDown() {
    setIsPressed(true);
    // Создаем новый шар, который будет следовать за мышью
    setHeldBall({
      id: Math.random(),
      size: 0.3 + Math.random() * 0.3,
      color: `hsl(${Math.random() * 360}, 80%, 60%)`,
      isHeld: true // Отмечаем, что шар "держат"
    });
  }
  
  function handleMouseUp() {
    if (heldBall) {
      // Когда отпускаем шар, добавляем его в общий список
      setBalls(balls => [...balls, { ...heldBall, isHeld: false }]);
      setHeldBall(null);
    }
    setIsPressed(false);
  }
  
  return (
    <Canvas
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      {/* Шар, который держат */}
      {heldBall && <HeldBall {...heldBall} />}
      
      {/* Все остальные шары */}
      {balls.map(ball => <FallingBall key={ball.id} {...ball} />)}
      
      <Pool />
    </Canvas>
  );
}
```

## Физические взаимодействия между шарами

Самое интересное - это наблюдать, как шары сталкиваются друг с другом! React Three Cannon автоматически обрабатывает эти столкновения - нам нужно только создать физические тела с правильными параметрами.

## Давай поэкспериментируем!

Попробуй изменить параметры шаров и посмотри, что произойдет:
- Увеличь или уменьши массу (mass)
- Измени упругость (restitution)
- Добавь шары разных размеров и цветов
- Попробуй создать много шаров сразу

## Готов создавать свой мир с физикой?

Теперь ты знаешь, как добавлять падающие шары в наш виртуальный бассейн! Экспериментируй с параметрами, создавай разные шары и наблюдай за красивыми физическими эффектами! 🔴🔵🟢