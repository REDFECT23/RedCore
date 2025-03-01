/* quests.js */
// Проверка наличия имени пользователя
if (!localStorage.getItem('username')) {
  window.location.href = '../pages/login.html'; // Измененный путь
}

// Получаем тему из localStorage и применяем её
const body = document.body;
const theme = localStorage.getItem('theme');
if (theme) {
  body.className = theme;
}

// Применяем пользовательские настройки
function applyCustomizations() {
    let textColor = localStorage.getItem('textColor') || '#0ff';
    let backgroundColor = localStorage.getItem('backgroundColor') || '#222';
    let fontFamily = localStorage.getItem('fontFamily') || "'Orbitron', sans-serif";
    let customFontPath = localStorage.getItem('customFontPath');
    let fontSize = localStorage.getItem('fontSize') || '1.1rem';
    let buttonShape = localStorage.getItem('buttonShape') || 'rounded';
    let animationsEnabled = localStorage.getItem('animationsEnabled') === 'true';
    let particleSize = localStorage.getItem('particleSize') || '8px';
    let particleCount = localStorage.getItem('particleCount') || '50';

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

    const buttonBorderRadius = buttonShape === 'rounded' ? '7px' : '0';
    document.documentElement.style.setProperty('--button-border-radius', buttonBorderRadius);

    if (!animationsEnabled) {
        document.documentElement.classList.add('no-animations');
    } else {
        document.documentElement.classList.remove('no-animations');
    }


    const particlesContainer = document.querySelector('.particles-container');
    particlesContainer.innerHTML = '';
    generateParticles(particleCount);
}


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


const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            cardObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});


const allQuests = [
    { id: 1, description: "Посетите главную страницу RedCore.", action: "visitHomepage", link: "../index.html" }, // Измененный путь
    { id: 2, description: "Отправьте сообщение в чате.", action: "chat", link: "../pages/chat.html" }, // Измененный путь
    { id: 3, description: "Измените настройки внешнего вида.", action: "settings", link: "../pages/settings.html" }, // Измененный путь
    { id: 4, description: "Посмотрите любой проект.", action: "viewProject", link: "#" },
    { id: 5, description: "Поставьте лайк любому проекту.", action: "likeProject", link: "#" },
];


function getRandomQuests(list, count) {
    const shuffled = list.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}


function generateQuestCard(quest, isCompleted) {
    const completedClass = isCompleted ? ' completed' : '';
    const buttonHTML = isCompleted
        ? `<i class="fas fa-check-circle complete-icon"></i>`
        : `<a href="${quest.link}" class="complete-button">Выполнить</a>`;

    return `
        <div class="quest-card${completedClass}" data-quest-id="${quest.id}">
            <h3><i class="fas fa-tasks"></i>${quest.description}</h3>
            <i class="fas fa-check-circle complete-icon"></i>
            ${buttonHTML}
        </div>
    `;
}


function displayDailyQuests() {
    const questsContainer = document.getElementById('daily-quests-container');
    questsContainer.innerHTML = '';

    const dailyQuests = getDailyQuests();

    dailyQuests.forEach(quest => {
        const questCardHTML = generateQuestCard(quest, isQuestCompleted(quest.id));
        questsContainer.innerHTML += questCardHTML;
    });


    observeQuestCards();
    updateQuestProgress();
}


function getDailyQuests() {
    const today = new Date().toLocaleDateString();
    let savedQuests = localStorage.getItem('dailyQuests');
    let savedDate = localStorage.getItem('dailyQuestsDate');

    if (savedQuests && savedDate === today) {
        return JSON.parse(savedQuests);
    } else {
        const randomQuests = getRandomQuests(allQuests, 3);
        localStorage.setItem('dailyQuests', JSON.stringify(randomQuests));
        localStorage.setItem('dailyQuestsDate', today);
        return randomQuests;
    }
}



function completeQuest(questId) {
  const questCard = document.querySelector(`.quest-card[data-quest-id="${questId}"]`);
  if (questCard) {
    questCard.classList.add('completed');
    markQuestCompleted(questId);
    updateQuestProgress();
    // Здесь можно добавить код для отправки информации на сервер
  }
}


function markQuestCompleted(questId) {
    let completed = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    if (!completed.includes(questId)) {
        completed.push(questId);
        localStorage.setItem('completedQuests', JSON.stringify(completed));
    }
}


function isQuestCompleted(questId) {
    let completed = JSON.parse(localStorage.getItem('completedQuests') || '[]');
    return completed.includes(questId);
}


function updateQuestProgress() {
    const dailyQuests = getDailyQuests();
    const completedQuests = dailyQuests.filter(quest => isQuestCompleted(quest.id));
    const progress = (completedQuests.length / dailyQuests.length) * 100;

    const progressBar = document.getElementById('quest-progress');
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${Math.round(progress)}%`;
}


function observeQuestCards() {
    const questCards = document.querySelectorAll('.quest-card');
    questCards.forEach(card => {
        cardObserver.observe(card);
    });
}


const cards = document.querySelectorAll('.quest-card');
cards.forEach((card, index) => {
    card.style.setProperty('--card-index', index);
});


const particlesContainer = document.querySelector('.particles-container');
let numParticles = localStorage.getItem('particleCount') || 50;
generateParticles(numParticles);


const sections = document.querySelectorAll('section');
const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            sectionObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.2
});

sections.forEach(section => {
    sectionObserver.observe(section);
});


applyCustomizations();


displayDailyQuests();