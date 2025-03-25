/* main.js */

// Проверка наличия имени пользователя
if (!localStorage.getItem('username')) {
    window.location.href = 'login.html';
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

    //  Шрифты (устаревший код, заменен на applyGlobalFont)
    /*
    if (customFontPath) { // Проверяем, указан ли путь к шрифту
      let style = document.getElementById('custom-font-style');
      if (!style) {
          style = document.createElement('style');
          style.id = 'custom-font-style';
          document.head.appendChild(style);
      }
      style.textContent = `@font-face { font-family: CustomFont; src: url(${customFontPath}); }`;
      document.documentElement.style.setProperty('--font-family', "CustomFont, sans-serif"); // Используем CustomFont
      console.log("Пытаюсь применить кастомный шрифт:", customFontPath);

    } else {
        document.documentElement.style.setProperty('--font-family', fontFamily);
        console.log("Стандартный шрифт:", fontFamily);
    }
    */


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


//Функция для создания частиц
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


// Функция для создания мини-кликеров (обновленная)
function createMiniClickers() {
    const cardsContainer = document.querySelector('.cards'); // Получаем контейнер с карточками
    if (!cardsContainer) return; // Если нет контейнера, выходим

    const numClickers = 5; // Количество кликеров

    for (let i = 0; i < numClickers; i++) {
        const clickerButton = document.createElement('button');
        clickerButton.classList.add('clicker-button');
        clickerButton.dataset.count = 0;
        clickerButton.innerHTML = `+1<span class="clicker-count">0</span>`;

        // Стили для кнопки
        clickerButton.style.cssText = `
            background-color: #ffcc00;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: transform 0.2s ease-in-out;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            position: absolute; /* Абсолютное позиционирование внутри карточки */
            z-index: 10; /* Чтобы кликеры были над содержимым карточки */
        `;

        if (body.classList.contains('light-theme')) {
            clickerButton.style.backgroundColor = 'rgba(255, 180, 66, 0.8)';
            clickerButton.style.color = '#333';
        }

        clickerButton.addEventListener('click', () => {
            clickerButton.dataset.count++;
            clickerButton.querySelector('.clicker-count').textContent = clickerButton.dataset.count;

            // Увеличение и небольшое вращение
            clickerButton.style.transform = 'scale(1.2) rotate(7deg)';
            setTimeout(() => {
                clickerButton.style.transform = 'scale(1) rotate(0)';
            }, 150);

            // Изменение цвета (более динамичное)
            const originalColor = clickerButton.style.backgroundColor;
            clickerButton.style.backgroundColor = 'hsl(' + (Math.random() * 360) + ', 100%, 50%)'; // Случайный цвет
            setTimeout(() => {
                clickerButton.style.backgroundColor = originalColor;
            }, 200);

            // Эффект "взрыва" (улучшенный)
            const explosion = document.createElement('div');
            explosion.classList.add('click-explosion');
            clickerButton.appendChild(explosion);

            explosion.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) scale(0); /* Начинаем с центра */
                width: 10px; /* Начальный размер */
                height: 10px;/* Начальный размер */
                background-color: rgba(255, 255, 255, 0.8);
                border-radius: 50%;
                pointer-events: none;
                animation: explode 0.4s ease-out forwards;
            `;

             // Добавим больше частиц
            for (let i = 0; i < 5; i++) {
                const particle = document.createElement('div');
                particle.classList.add('click-particle');
                clickerButton.appendChild(particle);

                particle.style.cssText = `
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: ${Math.random() * 8 + 2}px; /* Случайный размер */
                    height: ${Math.random() * 8 + 2}px; /* Случайный размер */
                    background-color: hsl(${Math.random() * 360}, 100%, 50%); /* Случайный цвет */
                    border-radius: 50%;
                    pointer-events: none;
                    animation: flyOut ${Math.random() * 0.6 + 0.4}s ease-out forwards; /* Случайная скорость */
                `;

                  //  Keyframes для анимации разлета частиц
                let style = document.getElementById('flyOut-keyframes');
                if(!style) {
                    style = document.createElement('style');
                    style.id = 'flyOut-keyframes'
                    style.innerHTML = `
                        @keyframes flyOut {
                          from {
                            transform: translate(-50%, -50%) scale(1);
                            opacity: 1;
                          }
                          to {
                            transform: translate(${(Math.random() - 0.5) * 200}px, ${(Math.random() - 0.5) * 200}px) scale(0); /* Разлет в случайном направлении */
                            opacity: 0;
                          }
                        }
                      `;
                      document.head.appendChild(style);
                }
            }

            setTimeout(() => {
              explosion.remove();
              //Удаляем все частички
               clickerButton.querySelectorAll('.click-particle').forEach(p => p.remove());

            }, 600); // Удаляем после анимации (должно совпадать с самым долгим временем анимации)
        });


        // Добавляем кнопку в случайную карточку
        const randomCard = cardsContainer.children[Math.floor(Math.random() * cardsContainer.children.length)];
        if (randomCard) {
            //Позицианируем
             clickerButton.style.left = `${Math.random() * (randomCard.offsetWidth - 40)}px`;  //Случайное смещение, вычитаем ширину кнопки
             clickerButton.style.top = `${Math.random() * (randomCard.offsetHeight - 20)}px`; //Случайное смещение, вычитаем высоту кнопки

            randomCard.appendChild(clickerButton);
        }
    }
}

// Функция для применения глобального шрифта
function applyGlobalFont(fontPath) {
  let style = document.getElementById('global-font-style');
  if (!style) {
    style = document.createElement('style');
    style.id = 'global-font-style';
    document.head.appendChild(style);
  }
  style.textContent = `
    @font-face {
      font-family: 'GlobalCustomFont';
      src: url(${fontPath});
    }
    * {
      font-family: 'GlobalCustomFont', sans-serif !important;
    }
  `;
}

// Вызываем applyGlobalFont при загрузке страницы, передавая путь к файлу шрифта
document.addEventListener('DOMContentLoaded', () => {
   //Здесь указываешь путь к файлу
  applyGlobalFont('RedCore/assets/avantgardebkbtrusbyme_demi.otf'); // Замените на ваш путь! Поддерживаемые форматы: .woff2, .woff, .ttf, .otf
  createMiniClickers(); // вызываем после смены шрифта
  applyCustomizations();

});
