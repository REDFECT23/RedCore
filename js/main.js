/* main.js */

// Проверка наличия имени пользователя
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
      let style = document.getElementById('custom-font-style');
      if (!style) {
          style = document.createElement('style');
          style.id = 'custom-font-style';
          document.head.appendChild(style);
      }
      style.textContent = `@font-face { font-family: CustomFont; src: url(${customFontPath}); }`;
      document.documentElement.style.setProperty('--font-family', "CustomFont, Orbitron, sans-serif");
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
    if (particlesContainer) { // Проверяем наличие контейнера
      particlesContainer.innerHTML = ''; // Очистить контейнер
      generateParticles(particleCount); // Сгенерировать частицы с новым количеством
    }
}


//Функция для создания частиц (перемещена в main.js)
function generateParticles(numParticles) {
    const particlesContainer = document.querySelector('.particles-container');
      if (!particlesContainer) return; // Если нет контейнера, выходим

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
if (particlesContainer) { // Проверяем наличие контейнера
    let numParticles = parseInt(localStorage.getItem('particleCount')) || 50;
    generateParticles(numParticles);
}



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

if(cards.length > 0){ // Проверяем наличие карточек
  cards.forEach(card => {
    cardObserver.observe(card);
  });
}


// Код для 3D вращения заголовка
const header = document.getElementById('mainHeader');  // Получаем заголовок по id
if (header) { // Проверяем наличие заголовка
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

        const h1 = header.querySelector('h1');
        if (h1) { // Проверяем наличие h1 внутри header
            h1.style.transform = `rotateY(${rotationY}deg)`; // Вращаем h1 внутри header
        }
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
         const h1 = header.querySelector('h1');
        if (h1) { // Проверяем наличие h1
          h1.style.transform = `rotateY(${rotationY}deg)`;
        }

        previousX = e.touches[0].clientX;
        e.preventDefault(); // Предотвращаем прокрутку страницы
    });

    header.addEventListener('touchend', () => {
        isDragging = false;
    });
}

// Создаем мини-кликеры
createMiniClickers();

// Применяем настройки при загрузке страницы
applyCustomizations();
