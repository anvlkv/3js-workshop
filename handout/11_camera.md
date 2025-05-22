# Камера: Наш взгляд на бассейн с шарами 📷

## Что такое камера в 3D?

Камера в 3D мире - это наши "глаза", через которые мы смотрим на сцену. От того, как настроена камера, зависит, что именно мы видим и под каким углом.

## Типы камер в Three.js

- **PerspectiveCamera** - перспективная камера, похожая на зрение человека (объекты вдали кажутся меньше) 👁️
- **OrthographicCamera** - ортографическая камера (все объекты имеют один размер независимо от расстояния) 📏

## Настройка камеры для нашего бассейна

```javascript
function App() {
  return (
    <Canvas 
      camera={{ 
        position: [0, 3, 12], // Положение камеры (x, y, z)
        fov: 50, // Угол обзора (Field of View)
        near: 0.1, // Ближняя плоскость отсечения
        far: 1000 // Дальняя плоскость отсечения
      }}
    >
      {/* Наш бассейн и шары будут здесь */}
    </Canvas>
  );
}
```

## Что означают параметры камеры?

- **position** - где находится камера в 3D пространстве
- **fov** - угол обзора в градусах (чем больше, тем шире обзор)
- **near** и **far** - определяют, какие объекты будут видны (слишком близкие или далекие объекты не отображаются)

## Управление камерой с помощью OrbitControls

OrbitControls позволяет пользователю вращать, приближать и перемещать камеру с помощью мыши:

```javascript
import { OrbitControls } from "@react-three/drei";

function CameraControls() {
  return (
    <>
      <OrbitControls 
        enableZoom={true} // Разрешить приближение/удаление
        enableRotate={true} // Разрешить вращение
        enablePan={true} // Разрешить перемещение
        maxDistance={20} // Максимальное расстояние для отдаления
        minDistance={2} // Минимальное расстояние для приближения
      />
    </>
  );
}
```

## Предустановленные ракурсы камеры

Мы можем создать кнопки для быстрого перемещения камеры в интересные позиции:

```javascript
function CameraPresets({ setCameraPosition }) {
  return (
    <div className="camera-presets">
      <h3>Выберите ракурс:</h3>
      <button onClick={() => setCameraPosition([0, 10, 0])}>
        Вид сверху 🔭
      </button>
      <button onClick={() => setCameraPosition([10, 3, 10])}>
        Вид сбоку 👀
      </button>
      <button onClick={() => setCameraPosition([0, 0, 15])}>
        Вид спереди 🎯
      </button>
      <button onClick={() => setCameraPosition([0, 3, 12])}>
        Стандартный вид 🏠
      </button>
    </div>
  );
}
```

## Анимация камеры

Мы можем создать плавное перемещение камеры между разными точками:

```javascript
function AnimatedCamera() {
  const cameraRef = useRef();
  const [target, setTarget] = useState([0, 3, 12]);
  
  // Анимируем перемещение камеры
  useFrame(() => {
    if (cameraRef.current) {
      // Плавно перемещаем камеру к целевой позиции
      cameraRef.current.position.x += (target[0] - cameraRef.current.position.x) * 0.05;
      cameraRef.current.position.y += (target[1] - cameraRef.current.position.y) * 0.05;
      cameraRef.current.position.z += (target[2] - cameraRef.current.position.z) * 0.05;
      
      // Смотрим на центр бассейна
      cameraRef.current.lookAt(0, -3, 0);
    }
  });
  
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 3, 12]} fov={50} />;
}
```

## Следование камеры за шаром

Камера может следовать за выбранным шаром, чтобы не терять его из виду:

```javascript
function FollowBallCamera({ targetBall }) {
  const cameraRef = useRef();
  
  useFrame(() => {
    if (targetBall && cameraRef.current) {
      // Получаем позицию шара
      const ballPosition = targetBall.current.position;
      
      // Устанавливаем камеру немного позади и выше шара
      cameraRef.current.position.x = ballPosition.x;
      cameraRef.current.position.y = ballPosition.y + 2;
      cameraRef.current.position.z = ballPosition.z + 5;
      
      // Смотрим на шар
      cameraRef.current.lookAt(ballPosition);
    }
  });
  
  return <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 3, 12]} fov={50} />;
}
```

## Интерактивный выбор шара для наблюдения

```javascript
function BallSelector({ balls, setTargetBall }) {
  return (
    <div className="ball-selector">
      <h3>Следить за шаром:</h3>
      <select onChange={(e) => setTargetBall(balls[e.target.value])}>
        <option value="">Свободная камера</option>
        {balls.map((ball, index) => (
          <option key={index} value={index}>
            Шар #{index + 1} ({ball.color})
          </option>
        ))}
      </select>
    </div>
  );
}
```

## Добавление эффектов постобработки

Используя эффекты постобработки, мы можем улучшить визуальное восприятие нашей сцены:

```javascript
import { EffectComposer, Bloom, DepthOfField } from "@react-three/postprocessing";

function CameraEffects() {
  return (
    <EffectComposer>
      <Bloom intensity={0.5} luminanceThreshold={0.2} /> {/* Эффект свечения */}
      <DepthOfField
        focusDistance={0} // Расстояние фокуса
        focalLength={0.02} // Фокусное расстояние
        bokehScale={2} // Интенсивность размытия
      />
    </EffectComposer>
  );
}
```

## Экспериментируй с камерой!

Попробуй создать свои уникальные ракурсы для наблюдения за бассейном и шарами:
- Настрой камеру так, чтобы видеть бассейн сверху
- Создай эффект "подводной" камеры, которая смотрит из дна бассейна
- Добавь функцию "замедленной съемки" при интересных столкновениях шаров
- Создай режим "от первого лица", где камера находится на одном из шаров

Разные ракурсы позволят тебе увидеть физику шаров с новых интересных сторон! 🎥✨🎬