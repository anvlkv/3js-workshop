# Продвинутое взаимодействие с шарами: Особые эффекты 🎇

## Улучшаем наши шары

Теперь, когда у нас есть бассейн и базовые падающие шары, давайте добавим более интересные взаимодействия и эффекты!

## Разные типы шаров

Мы можем создавать шары с разными свойствами:

```javascript
function СпециальныйШар({ position, size, color, type }) {
  // Выбираем свойства в зависимости от типа шара
  const properties = {
    normal: { mass: size * 10, restitution: 0.8, linearDamping: 0.1 },
    heavy: { mass: size * 30, restitution: 0.4, linearDamping: 0.3 },
    bouncy: { mass: size * 5, restitution: 0.95, linearDamping: 0.05 },
    floating: { mass: size * 2, restitution: 0.7, linearDamping: 0.01 }
  };
  
  const selected = properties[type] || properties.normal;
  
  // Создаем физическое тело для шара
  const [ref] = useSphere(() => ({
    ...selected,
    position,
    args: [size]
  }));

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        metalness={0.5} 
        roughness={0.1}
        emissive={color}
        emissiveIntensity={0.2} // Слабое свечение
      />
    </mesh>
  );
}
```

## Эффекты при столкновении

Давайте добавим эффекты при столкновении шаров со стенками:

```javascript
function ЭффектСтолкновения({ position, color, size }) {
  // Эффект будет уменьшаться и исчезать
  const [scale, setScale] = useState(1);
  
  useEffect(() => {
    // Создаем анимацию уменьшения
    const timer = setInterval(() => {
      setScale(prev => {
        if (prev <= 0.1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 0.05;
      });
    }, 50);
    
    return () => clearInterval(timer);
  }, []);

  if (scale <= 0) return null;

  return (
    <mesh position={position}>
      <sphereGeometry args={[size * 1.5 * scale, 16, 16]} />
      <meshStandardMaterial 
        color={color}
        transparent={true}
        opacity={scale * 0.5}
        emissive={color}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
```

## Как обнаружить столкновения?

```javascript
function СистемаШаров() {
  const [эффекты, установитьЭффекты] = useState([]);
  
  // Создаем мир с обработкой столкновений
  const world = useRef();
  
  useEffect(() => {
    if (world.current) {
      // Добавляем обработчик событий столкновения
      world.current.addEventListener('collide', (event) => {
        // Проверяем силу удара
        if (event.contact.getImpactVelocityAlongNormal() > 5) {
          // Создаем новый эффект в месте столкновения
          const position = event.contact.bi.position;
          const id = Math.random();
          const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
          
          установитьЭффекты(prev => [...prev, { id, position, color, size: 0.5 }]);
          
          // Удаляем эффект через 1 секунду
          setTimeout(() => {
            установитьЭффекты(prev => prev.filter(эф => эф.id !== id));
          }, 1000);
        }
      });
    }
  }, [world]);

  return (
    <Physics ref={world} gravity={[0, -9.81, 0]}>
      <Pool />
      {/* Отображаем все шары */}
      {шары.map(шар => (
        <СпециальныйШар key={шар.id} {...шар} />
      ))}
      
      {/* Отображаем эффекты столкновений */}
      {эффекты.map(эффект => (
        <ЭффектСтолкновения key={эффект.id} {...эффект} />
      ))}
    </Physics>
  );
}
```

## Звуковые эффекты

Добавим звуки при столкновениях:

```javascript
function ЗвуковыеЭффекты() {
  // Загружаем звуки
  const [звукУдара] = useState(() => new Audio('/sounds/collision.mp3'));
  const [звукВсплеска] = useState(() => new Audio('/sounds/splash.mp3'));
  
  // Функция для воспроизведения звука удара
  const проигратьЗвукУдара = useCallback((сила) => {
    // Громкость зависит от силы удара
    звукУдара.volume = Math.min(сила / 10, 1);
    звукУдара.currentTime = 0;
    звукУдара.play();
  }, [звукУдара]);
  
  // Функция для воспроизведения звука всплеска
  const проигратьЗвукВсплеска = useCallback(() => {
    звукВсплеска.currentTime = 0;
    звукВсплеска.play();
  }, [звукВсплеска]);
  
  return { проигратьЗвукУдара, проигратьЗвукВсплеска };
}
```

## Создание специальных шаров

Давайте добавим возможность создавать разные типы шаров:

```javascript
function ПанельУправления({ создатьШар }) {
  const [выбранныйТип, установитьТип] = useState("normal");
  
  return (
    <div className="панель-управления">
      <h3>Типы шаров:</h3>
      <button 
        onClick={() => установитьТип("normal")}
        className={выбранныйТип === "normal" ? "активный" : ""}
      >
        Обычный 🔴
      </button>
      <button 
        onClick={() => установитьТип("heavy")}
        className={выбранныйТип === "heavy" ? "активный" : ""}
      >
        Тяжелый 🟣
      </button>
      <button 
        onClick={() => установитьТип("bouncy")}
        className={выбранныйТип === "bouncy" ? "активный" : ""}
      >
        Прыгучий 🟢
      </button>
      <button 
        onClick={() => установитьТип("floating")}
        className={выбранныйТип === "floating" ? "активный" : ""}
      >
        Плавающий 🔵
      </button>
      
      <button 
        className="кнопка-создать"
        onClick={() => создатьШар(выбранныйТип)}
      >
        Создать шар!
      </button>
    </div>
  );
}
```

## Интересные идеи для экспериментов

- Добавь шары, которые меняют цвет при столкновении
- Создай шары, которые разбиваются на маленькие при сильном ударе
- Добавь шары, которые притягиваются или отталкиваются друг от друга
- Создай эффект "воды" на дне бассейна, чтобы шары замедлялись в ней
- Придумай уровни сложности, где нужно бросить шары определенным образом

## Готов к экспериментам?

Попробуй добавить свои собственные типы шаров и эффекты! Ты можешь создать уникальный бассейн с необычными физическими свойствами и удивительными эффектами! 🎮✨🔮