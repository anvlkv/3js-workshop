# Three.js: Волшебство 3D графики 🎮

## Что такое Three.js?

Three.js - это специальная библиотека JavaScript, которая помогает нам создавать и отображать 3D графику в браузере. С её помощью мы можем создать наш трёхмерный бассейн и шары!

## Основные понятия в Three.js

### Сцена (Scene) - наш 3D мир 🌐

```
// Создаём сцену - пространство, где будут жить все наши объекты
const сцена = new THREE.Scene();
```

### Камера (Camera) - наши глаза в 3D мире 📷

```
// Создаём камеру, через которую мы видим сцену
const камера = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
камера.position.set(0, 3, 12); // Установим камеру так, чтобы хорошо видеть бассейн
```

### Рендерер (Renderer) - превращает 3D в картинку 🖼️

```
// Создаём рендерер - он будет отрисовывать нашу сцену
const рендерер = new THREE.WebGLRenderer();
рендерер.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(рендерер.domElement);
```

### Геометрия (Geometry) - форма объекта 📦

```
// Создаём геометрию для шара
const геометрияШара = new THREE.SphereGeometry(0.5, 32, 32);

// Геометрия для стенки бассейна
const геометрияСтенки = new THREE.BoxGeometry(8, 2, 0.5);
```

### Материал (Material) - внешний вид объекта 🎨

```
// Материал для шара - блестящий и яркий
const материалШара = new THREE.MeshStandardMaterial({
  color: 0xff0000,
  metalness: 0.5,
  roughness: 0.1
});

// Материал для стенок бассейна
const материалСтенки = new THREE.MeshStandardMaterial({
  color: 0xfa4060,
  roughness: 0.5
});
```

### Меш (Mesh) - объединение геометрии и материала 🧠

```
// Создаём шар, объединяя геометрию и материал
const шар = new THREE.Mesh(геометрияШара, материалШара);
шар.position.set(0, 5, 0); // Положение шара в пространстве
сцена.add(шар); // Добавляем шар на сцену
```

### Освещение (Lights) - свет для нашей сцены 💡

```
// Добавляем источники света
const окружающийСвет = new THREE.AmbientLight(0xffffff, 0.3);
сцена.add(окружающийСвет);

const направленныйСвет = new THREE.DirectionalLight(0xffffff, 1);
направленныйСвет.position.set(10, 10, 5);
сцена.add(направленныйСвет);
```

## Анимация в Three.js - движение в нашем мире 🎬

```
// Функция для анимации
function анимация() {
  requestAnimationFrame(анимация);
  
  // Здесь мы обновляем положение шаров
  шары.forEach(шар => {
    шар.position.y -= 0.05; // Шар падает вниз
  });
  
  рендерер.render(сцена, камера);
}

анимация(); // Запускаем анимацию
```

## Как Three.js помогает в нашем проекте?

- Создаёт 3D объекты: бассейн, стенки, шары
- Добавляет освещение, чтобы всё выглядело реалистично
- Управляет камерой, чтобы мы могли видеть нашу сцену
- Обновляет изображение много раз в секунду, создавая плавную анимацию

## В нашем проекте Three.js и React соединяются вместе

С помощью библиотеки React Three Fiber мы можем использовать Three.js вместе с React, что делает наш код более организованным и понятным.

## Готов создавать свой 3D мир? 🏊‍♂️🔴🔵

Теперь мы знаем основы Three.js и можем приступать к созданию нашего бассейна с шарами!