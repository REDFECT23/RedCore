/* settings.js */

const checkbox = document.getElementById('checkbox');
const body = document.body;

// Функция для установки темы
function setTheme(themeName) {
  localStorage.setItem('theme', themeName);
  body.className = themeName;
}

// Функция для переключения темы
function toggleTheme() {
  if (localStorage.getItem('theme') === 'light-theme') {
    setTheme('');
  } else {
    setTheme('light-theme');
  }
}


checkbox.addEventListener('change', toggleTheme);

(function() {
  if (localStorage.getItem('theme') === 'light-theme') {
    setTheme('light-theme');
    document.getElementById('checkbox').checked = true;
  } else {
    setTheme('');
    document.getElementById('checkbox').checked = false;
  }
})();


function openTab(tabName) {
    const tabContents = document.querySelectorAll('.tab-content');
    const tabButtons = document.querySelectorAll('.tab-button');

    tabContents.forEach(tab => tab.classList.remove('active'));
    tabButtons.forEach(button => button.classList.remove('active'));

    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab-buttons button[onclick="openTab('${tabName}')"]`).classList.add('active');
}


function applySettings() {
    // Общие настройки
    const textColor = document.getElementById('text-color').value;
    const backgroundColor = document.getElementById('background-color').value;
    let fontFamily = document.getElementById('font-family').value;
    const fontSize = document.getElementById('font-size').value + 'rem';
    const buttonShape = document.querySelector('input[name="button-shape"]:checked').value;
    const animationsEnabled = document.getElementById('animations-enabled').checked;
    const particleSize = document.getElementById('particle-size').value + 'px';
    const particleCount = document.getElementById('particle-count').value;


    const messageColor = document.getElementById('message-color').value;
    const usernameColor = document.getElementById('username-color').value;
    const chatFontSize = document.getElementById('chat-font-size').value + 'rem';
    const chatBackgroundColor = document.getElementById('chat-background-color').value;
    const chatMessageMaxWidth = document.getElementById('chat-message-max-width').value + 'px';
    const chatInputStyle = document.getElementById('chat-input-style').value;
    const showChatTime = document.getElementById('show-chat-time').checked;
    const timeFormat = document.getElementById('time-format').value;
    const messageBorderRadius = document.getElementById('message-border-radius').value + 'px';
    const usernameFontWeight = document.getElementById('username-font-weight').value;
    const maxMessagesDisplayed = document.getElementById('max-messages-displayed').value;
    const messageTextTransform = document.getElementById('message-text-transform').value;
    const enableEmojis = document.getElementById('enable-emojis').checked;

    // Режим низкой детализации
    const lowDetailMode = document.getElementById('low-detail-mode').checked;
    localStorage.setItem('lowDetailMode', lowDetailMode);

    const customFontFile = document.getElementById('custom-font-file').files[0];

    if (fontFamily === "CustomFont" && customFontFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
            const fontPath = event.target.result;
            localStorage.setItem('customFontPath', fontPath);
            localStorage.setItem('fontFamily', "CustomFont");
            applyCustomizationsToAllPages();
        };
        reader.readAsDataURL(customFontFile);
    } else {
        localStorage.setItem('fontFamily', fontFamily);
        localStorage.removeItem('customFontPath');
        applyCustomizationsToAllPages();
    }

    localStorage.setItem('textColor', textColor);
    localStorage.setItem('backgroundColor', backgroundColor);
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('buttonShape', buttonShape);
    localStorage.setItem('animationsEnabled', animationsEnabled);
    localStorage.setItem('particleSize', particleSize);
    localStorage.setItem('particleCount', particleCount);


    localStorage.setItem('messageColor', messageColor);
    localStorage.setItem('usernameColor', usernameColor);
    localStorage.setItem('chatFontSize', chatFontSize);
    localStorage.setItem('chatBackgroundColor', chatBackgroundColor);
    localStorage.setItem('chatMessageMaxWidth', chatMessageMaxWidth);
    localStorage.setItem('chatInputStyle', chatInputStyle);
    localStorage.setItem('showChatTime', showChatTime);
    localStorage.setItem('timeFormat', timeFormat);
    localStorage.setItem('messageBorderRadius', messageBorderRadius);
    localStorage.setItem('usernameFontWeight', usernameFontWeight);
    localStorage.setItem('maxMessagesDisplayed', maxMessagesDisplayed);
    localStorage.setItem('messageTextTransform', messageTextTransform);
    localStorage.setItem('enableEmojis', enableEmojis);


    alert('Настройки применены! Обновите страницу, чтобы увидеть изменения.');
}


function logout() {
    localStorage.removeItem('username');
    window.location.href = '../pages/login.html'; // Изменен путь
}


function applyCustomizationsToAllPages() {
    applyStyles();
}



function applyStyles() {

    let textColor = localStorage.getItem('textColor') || '#0ff';
    let backgroundColor = localStorage.getItem('backgroundColor') || '#222';
    let fontFamily = localStorage.getItem('fontFamily') || "'Orbitron', sans-serif";
    let customFontPath = localStorage.getItem('customFontPath');
    let fontSize = localStorage.getItem('fontSize') || '1.1rem';
    let buttonShape = localStorage.getItem('buttonShape') || 'rounded';
    let particleSize = localStorage.getItem('particleSize') || '8px';

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
}


applyStyles();