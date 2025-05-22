# Создание бассейна: Наш первый 3D объект 🏊‍♂️

## Что такое бассейн в нашем проекте?

Бассейн - это основной элемент нашей 3D сцены, где будут падать и отскакивать шары. Он состоит из дна и четырех стенок, образующих замкнутое пространство.

## Как создать бассейн в Three.js?

Бассейн будет состоять из нескольких частей:
- Дно (плоская поверхность)
- Четыре стенки (прямоугольные блоки)

## Код для создания бассейна

```javascript
function Pool() {
  const poolSize = 8; // Размер бассейна
  const wallThickness = 0.5; // Толщина стенок
  const wallHeight = 2; // Высота стенок

  // Используем физику для создания дна
  const [floorRef] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0], // Повернуть плоскость горизонтально
    position: [0, -5, 0], // Положение дна
    type: "Static", // Дно неподвижно
    material: { restitution: 0.5 }, // Дно немного пружинит
  }));

  // Создаем стенки бассейна
  const [leftWallRef] = useBox(() => ({
    position: [-poolSize / 2 - wallThickness / 2, -5 + wallHeight / 2, 0],
    args: [wallThickness, wallHeight, poolSize], // Размеры стенки
    type: "Static",
    material: { restitution: 0.7 }, // Стенки сильнее пружинят
  }));

  // Аналогично для остальных стенок
  const [rightWallRef] = useBox(() => ({
    position: [poolSize / 2 + wallThickness / 2, -5 + wallHeight / 2, 0],
    args: [wallThickness, wallHeight, poolSize],
    type: "Static",
    material: { restitution: 0.7 },
  }));

  // ... еще две стенки (передняя и задняя)

  return (
    <>
      {/* Дно бассейна */}
      <mesh ref={floorRef} receiveShadow>
        <planeGeometry args={[poolSize, poolSize]} />
        <meshStandardMaterial color="#303045" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Левая стенка */}
      <mesh ref={leftWallRef} receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, poolSize]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Правая стенка */}
      <mesh ref={rightWallRef} receiveShadow>
        <boxGeometry args={[wallThickness, wallHeight, poolSize]} />
        <meshStandardMaterial color="#fa4060" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* ... еще две стенки */}
    </>
  );
}
```

## Что происходит в этом коде?

1. **usePlane** и **useBox** - это функции из библиотеки react-three-cannon, которые добавляют физику нашим объектам
2. **mesh** - это объект Three.js, который объединяет геометрию (форму) и материал (внешний вид)
3. **receiveShadow** - позволяет объекту принимать тени от других объектов
4. **material** - определяет, как объект выглядит (цвет, блеск, шероховатость)

## Что такое физика в нашем проекте?

Физика позволяет объектам в нашей сцене вести себя реалистично:
- Шары падают под действием гравитации
- Объекты сталкиваются и отскакивают друг от друга
- Материалы могут быть более или менее упругими (restitution)

## Что такое параметры материала?

- **color** - цвет объекта
- **roughness** - шероховатость поверхности (0 - идеально гладкая, 1 - очень шероховатая)
- **metalness** - металличность поверхности (0 - неметаллическая, 1 - полностью металлическая)

## Давай добавим бассейн в нашу сцену!

Теперь мы готовы добавить бассейн в наш проект. Это будет первый шаг к созданию нашего интерактивного 3D мира с физикой!

## Идеи для улучшения

- Добавить текстуру воды на дно бассейна
- Сделать стенки полупрозрачными
- Добавить декоративные элементы вокруг бассейна
- Изменить цвета стенок для более интересного дизайна