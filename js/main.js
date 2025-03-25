/* main.js */
//Проверка наличия имени пользователя
if (!localStorage.getItem('username')) {
  window.location.href = 'login.html';  // Исправлен путь
}

// Получаем тему из localStorage и применяем её
const body = document.body;
const theme = localStorage.getItem('theme');
if (theme) {
  body.className = theme;
}

// Применяем пользовательские настройки
function applyCustomizations() {
    // Получаем настройки из localStorage
    let textColor = localStorage.getItem('textColor') || '#0ff';
    let backgroundColor = localStorage.getItem('backgroundColor') || '#222';
    let fontFamily = localStorage.getItem('fontFamily') || "'Orbitron', sans-serif";
    let customFontPath = localStorage.getItem('customFontPath');
    let fontSize = localStorage.getItem('fontSize') || '1.1rem';
    let buttonShape = localStorage.getItem('buttonShape') || 'rounded';
    let animationsEnabled = localStorage.getItem('animationsEnabled') === 'true';
    let particleSize = localStorage.getItem('particleSize') || '8px';
    let particleCount = localStorage.getItem('particleCount') || '50'; // Преобразование в число

    // Устанавливаем переменные CSS
    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
    if (fontFamily === "CustomFont" && customFontPath) {
        document.documentElement.style.setProperty('--font-family', "CustomFont, Orbitron, sans-serif");
        document.documentElement.style.setProperty('--custom-font-path', `url(${customFontPath})`);
        console.log("Пытаюсь применить кастомный шрифт:", customFontPath);
    } else {
        document.documentElement.style.setProperty('--font-family', fontFamily);
        console.log("Стандартный шрифт:", fontFamily);
    }
    document.documentElement.style.setProperty('--font-size', fontSize);
    document.documentElement.style.setProperty('--particle-size', particleSize);

    //Кнопки
    const buttonBorderRadius = buttonShape === 'rounded' ? '7px' : '0';
    document.documentElement.style.setProperty('--button-border-radius', buttonBorderRadius);

    //Включение или выключение анимаций
    if (!animationsEnabled) {
        document.documentElement.classList.add('no-animations');
    } else {
        document.documentElement.classList.remove('no-animations');
    }

    //Частицы (необходимо пересоздать контейнер)
    const particlesContainer = document.querySelector('.particles-container');
    particlesContainer.innerHTML = ''; // Очистить контейнер
    generateParticles(particleCount); // Сгенерировать частицы с новым количеством
}


//Функция для создания частиц (перемещена в main.js)
function generateParticles(numParticles) {
    const particlesContainer = document.querySelector('.particles-container');
    const particleSize = localStorage.getItem('particleSize') || '8px';

    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        particle.style.width = particleSize;
        particle.style.height = particleSize;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        const randomX = (Math.random() - 0.5) * 100 + 'vh';
        const randomY = (Math.random() - 0.5) * 100 + 'vw';
        particle.style.setProperty('--random-x', randomX);
        particle.style.setProperty('--random-y', randomY);

        particle.style.animationDelay = `${Math.random() * 2}s`;
        particle.style.animationDuration = `${Math.random() * 5 + 5}s`;

        particlesContainer.appendChild(particle);
    }
}

// Назначение переменной --card-index для каждой карточки
const cards = document.querySelectorAll('.card');
cards.forEach((card, index) => {
card.style.setProperty('--card-index', index);
});


// Генерация частиц
const particlesContainer = document.querySelector('.particles-container');
let numParticles = parseInt(localStorage.getItem('particleCount')) || 50;
generateParticles(numParticles);


// Intersection Observer для секций
const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('fade-in');
sectionObserver.unobserve(entry.target);
}
});
}, {
threshold: 0.2 // Начать анимацию, когда 20% секции видно
});

sections.forEach(section => {
sectionObserver.observe(section);
});


 // Intersection Observer для карточек
const cardObserver = new IntersectionObserver(entries => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('show');
cardObserver.unobserve(entry.target); // Прекращаем наблюдение после показа
}
});
}, {
threshold: 0.2 // Порог видимости (20% элемента должно быть видно)
});

cards.forEach(card => {
cardObserver.observe(card);
});

// Код для 3D вращения заголовка
const header = document.getElementById('mainHeader');  // Получаем заголовок по id
let isDragging = false;
let previousX = 0;
let rotationY = 0;

header.addEventListener('mousedown', (e) => {
    isDragging = true;
    previousX = e.clientX;
});

header.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - previousX;
    rotationY += deltaX * 0.2; // Скорость вращения

    header.querySelector('h1').style.transform = `rotateY(${rotationY}deg)`; // Вращаем h1 внутри header

    previousX = e.clientX;
});


header.addEventListener('mouseup', () => {
    isDragging = false;
});

header.addEventListener('mouseleave', () => {
    isDragging = false;
});


// Для тач-устройств
header.addEventListener('touchstart', (e) => {
    isDragging = true;
    previousX = e.touches[0].clientX;
});

header.addEventListener('touchmove', (e) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - previousX;
    rotationY += deltaX * 0.2; // Скорость вращения
    header.querySelector('h1').style.transform = `rotateY(${rotationY}deg)`;

    previousX = e.touches[0].clientX;
    e.preventDefault(); // Предотвращаем прокрутку страницы
});

header.addEventListener('touchend', () => {
    isDragging = false;
});

// Функция для создания мини-кликеров
function createMiniClickers() {
    const clickerContainer = document.createElement('div');
    clickerContainer.classList.add('clicker-container');
    clickerContainer.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        display: flex;
        flex-direction: column; /* Кнопки вертикально */
        align-items: flex-end; /* Выравнивание по правому краю */
        gap: 5px;
        z-index: 1001; /* Над кнопкой настроек */
        overflow-x: auto; /* Добавляем горизонтальный скролл */
        max-width: 90%; /* Ограничиваем ширину */
        white-space: nowrap;  /* Запрещаем перенос кнопок */
        padding: 5px; /* Небольшой отступ */
    `;

    const numClickers = 5; // Количество кликеров (можно настроить)

    for (let i = 0; i < numClickers; i++) {
        const clickerButton = document.createElement('button');
        clickerButton.classList.add('clicker-button');
        clickerButton.dataset.count = 0; // Начальное значение счетчика
        clickerButton.innerHTML = `+1<span class="clicker-count">0</span>`; // Отображаем счетчик
        clickerButton.style.cssText = `
            background-color: #ffcc00;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            margin-left: 5px;  /* Добавляем отступ между кнопками */
            font-size: 0.9rem;
            transition: transform 0.2s ease-in-out;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            
             /* Стили для контейнера с эффектом параллакса */
            .parallax-container {
                position: relative;
                overflow: hidden;
                height: 300px; /* Высота контейнера */
                margin-bottom: 30px; /* Отступ снизу */
            }

            .parallax-background {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 200%; /* Высота фона в два раза больше */
                background-image: url('path/to/your/image.jpg'); /* Замените на URL вашего изображения */
                background-size: cover;
                background-position: center;
                z-index: -1;
             }
`;
         // Добавлено:
         body.light-theme .clicker-button {
             background-color: rgba(255, 180, 66, 0.8);
             color: #333;
         }

        clickerButton.addEventListener('click', () => {
            clickerButton.dataset.count++;
            clickerButton.querySelector('.clicker-count').textContent = clickerButton.dataset.count;
             clickerButton.style.transform = 'scale(1.1)'; // Увеличение при нажатии
            setTimeout(() => clickerButton.style.transform = 'scale(1)', 150); // Возвращаем масштаб

             //Добавлено: Эффект "взрыва" при клике (можно добавить через CSS-анимацию)
             const explosion = document.createElement('div');
             explosion.classList.add('click-explosion');
             clickerButton.appendChild(explosion);

              //Стили для анимации взрыва
             explosion.style.cssText = `
                 position: absolute;
                 top: 0;
                 left: 0;
                 width: 100%;
                 height: 100%;
                 background-color: rgba(255, 255, 255, 0.5);
                 border-radius: 50%;
                 pointer-events: none;  /*Чтобы клики проходили сквозь*/
                 animation: explode 0.3s ease-out forwards;
            `;


              //Добавлено: Определение keyframes для анимации взрыва
              let style = document.createElement('style');
                style.innerHTML = `
                  @keyframes explode {
                      0% {
                        transform: scale(0);
                        opacity: 1;
                      }
                      100% {
                        transform: scale(2);
                        opacity: 0;
                      }
                  }
                `;
                document.head.appendChild(style);

               setTimeout(() => explosion.remove(), 300); // Удаляем элемент после анимации

            });
        clickerContainer.appendChild(clickerButton);
    }

    document.body.appendChild(clickerContainer);
}


// Создаем мини-кликеры
createMiniClickers();

applyCustomizations();
