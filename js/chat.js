// chat.js
// Получаем имя пользователя из localStorage
const username = localStorage.getItem('username');

// Проверяем наличие имени пользователя
if (!username) {
  window.location.href = '../pages/login.html'; // Измененный путь
}

const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');


let textColor = localStorage.getItem('textColor') || '#0ff';
let messageColor = localStorage.getItem('messageColor') || '#333';
let usernameColor = localStorage.getItem('usernameColor') || '#ffcc00';
let chatFontSize = localStorage.getItem('chatFontSize') || '1rem';
let chatBackgroundColor = localStorage.getItem('chatBackgroundColor') || '#222';
let chatMessageMaxWidth = localStorage.getItem('chatMessageMaxWidth') || '600px';
let chatInputStyle = localStorage.getItem('chatInputStyle') || 'rounded';
let showChatTime = localStorage.getItem('showChatTime') === 'true';
let timeFormat = localStorage.getItem('timeFormat') || '24';
let messageBorderRadius = localStorage.getItem('messageBorderRadius') || '8px';
let usernameFontWeight = localStorage.getItem('usernameFontWeight') || 'bold';
let maxMessagesDisplayed = localStorage.getItem('maxMessagesDisplayed') || '50';
let messageTextTransform = localStorage.getItem('messageTextTransform') || 'none';
let enableEmojis = localStorage.getItem('enableEmojis') === 'true';

// Шрифт
let fontFamily = localStorage.getItem('fontFamily') || "'Orbitron', sans-serif";
let customFontPath = localStorage.getItem('customFontPath');

if (fontFamily === "CustomFont" && customFontPath) {
    document.documentElement.style.setProperty('--font-family', "CustomFont, Orbitron, sans-serif");
    document.documentElement.style.setProperty('--custom-font-path', `url(${customFontPath})`);
    console.log("Пытаюсь применить кастомный шрифт в Chat:", customFontPath);
} else {
    document.documentElement.style.setProperty('--font-family', fontFamily);
    console.log("Стандартный шрифт:", fontFamily);
}


document.documentElement.style.setProperty('--text-color', textColor);
document.documentElement.style.setProperty('--message-color', messageColor);
document.documentElement.style.setProperty('--username-color', usernameColor);
document.documentElement.style.setProperty('--chat-font-size', chatFontSize);
document.documentElement.style.setProperty('--chat-background-color', chatBackgroundColor);
document.documentElement.style.setProperty('--chat-message-max-width', chatMessageMaxWidth);
document.documentElement.style.setProperty('--message-border-radius', messageBorderRadius);
document.documentElement.style.setProperty('--username-font-weight', usernameFontWeight);
document.documentElement.style.setProperty('--message-text-transform', messageTextTransform);


const maxMessages = parseInt(maxMessagesDisplayed, 10) || 50;

const chatInput = document.getElementById('chat-input');
chatInput.className = 'chat-input';
if (chatInputStyle === 'square') {
    chatInput.classList.add('square-input');
}


function sendMessage() {
    const messageText = messageInput.value.trim();

    if (messageText !== '') {

        const messageElement = document.createElement('div');
        messageElement.classList.add('message', 'user-message');


        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const timeString = `${hours}:${minutes}`;


        let messageContent = `<span class="username" style="color: var(--username-color); font-weight: var(--username-font-weight);">${username}:</span> ${messageText}`;

        if (showChatTime) {
            messageContent += `<span class="time">(${timeString})</span>`;
        }

        messageElement.innerHTML = messageContent;


        chatMessages.appendChild(messageElement);


        messageInput.value = '';


        chatMessages.scrollTop = chatMessages.scrollHeight;


        while (chatMessages.children.length > maxMessages) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }
}


chatMessages.scrollTop = chatMessages.scrollHeight;


messageInput.addEventListener("keyup", function (event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});


const body = document.body;
const theme = localStorage.getItem('theme');
if (theme) {
    body.className = theme;
}

function applyCustomizations() {
    textColor = localStorage.getItem('textColor') || '#0ff';
    messageColor = localStorage.getItem('messageColor') || '#333';
    usernameColor = localStorage.getItem('usernameColor') || '#ffcc00';
    chatFontSize = localStorage.getItem('chatFontSize') || '1rem';
    chatBackgroundColor = localStorage.getItem('chatBackgroundColor') || '#222';
    chatMessageMaxWidth = localStorage.getItem('chatMessageMaxWidth') || '600px';
    chatInputStyle = localStorage.getItem('chatInputStyle') || 'rounded';
    showChatTime = localStorage.getItem('showChatTime') === 'true';
    timeFormat = localStorage.getItem('timeFormat') || '24';
    messageBorderRadius = localStorage.getItem('messageBorderRadius') || '8px';
    usernameFontWeight = localStorage.getItem('usernameFontWeight') || 'bold';
    maxMessagesDisplayed = localStorage.getItem('maxMessagesDisplayed') || '50';
    messageTextTransform = localStorage.getItem('messageTextTransform') || 'none';
    enableEmojis = localStorage.getItem('enableEmojis') === 'true';
    fontFamily = localStorage.getItem('fontFamily') || "'Orbitron', sans-serif";
    customFontPath = localStorage.getItem('customFontPath');


    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--message-color', messageColor);
    document.documentElement.style.setProperty('--username-color', usernameColor);
    document.documentElement.style.setProperty('--chat-font-size', chatFontSize);
    document.documentElement.style.setProperty('--chat-background-color', chatBackgroundColor);
    document.documentElement.style.setProperty('--chat-message-max-width', chatMessageMaxWidth);
    document.documentElement.style.setProperty('--message-border-radius', messageBorderRadius);
    document.documentElement.style.setProperty('--username-font-weight', usernameFontWeight);
    document.documentElement.style.setProperty('--message-text-transform', messageTextTransform);


    if (fontFamily === "CustomFont" && customFontPath) {
        document.documentElement.style.setProperty('--font-family', "CustomFont, Orbitron, sans-serif");
        document.documentElement.style.setProperty('--custom-font-path', `url(${customFontPath})`);
        console.log("Пытаюсь применить кастомный шрифт в Chat:", customFontPath);
    } else {
        document.documentElement.style.setProperty('--font-family', fontFamily);
        console.log("Стандартный шрифт:", fontFamily);
    }


    const chatInput = document.getElementById('chat-input');
    chatInput.className = 'chat-input';
    if (chatInputStyle === 'square') {
        chatInput.classList.add('square-input');
    }
}


applyCustomizations();


const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button'); // Получаем кнопку отправки

function sendMessage() {
    const message = messageInput.value.trim();
    if (message === '') return;

    // Добавляем сообщение в чат (визуально)
    addMessage(message, 'user');
    messageInput.value = '';

    // Отправляем сообщение на сервер
    const xhr = new XMLHttpRequest();
    xhr.open('POST', '../php/send_message.php'); // Путь к PHP скрипту
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Сообщение успешно отправлено
            console.log('Сообщение отправлено!');
            loadMessages(); // Загружаем новые сообщения с сервера

        } else {
            console.error('Ошибка отправки сообщения:', xhr.status);
            // Обработка ошибки (например, отображение сообщения об ошибке)
        }
    };
    xhr.send(`username=${encodeURIComponent(username)}&message=${encodeURIComponent(message)}`);
}

// Функция для загрузки сообщений с сервера
function loadMessages() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '../php/get_messages.php'); // Путь к PHP скрипту
    xhr.onload = function() {
        if (xhr.status === 200) {
          
            try {
                const messages = JSON.parse(xhr.responseText); // Парсим JSON
                chatMessages.innerHTML = ''; // Очищаем чат перед добавлением новых сообщений
                messages.forEach(msg => addMessage(msg.message, msg.username === username ? 'user' : 'other', msg.username));


            } catch (error) {
                console.error("Ошибка парсинга JSON:", error);
            }
           
        } else {
            console.error('Ошибка загрузки сообщений:', xhr.status);
        }
    };
    xhr.send();
}



function addMessage(message, type, sender = null) { // Добавлен необязательный параметр sender
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${type}-message`);

    // Если sender указан (сообщение от другого пользователя), добавляем имя отправителя
    const messageContent = sender ? `<span class="username">${sender}:</span> ${message}` : message;
    messageElement.innerHTML = messageContent; // Добавляем имя к сообщению
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Прокручиваем чат вниз
}



sendButton.addEventListener('click', sendMessage); // Добавляем обработчик события click
messageInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

loadMessages(); // Загружаем сообщения при загрузке страницы
setInterval(loadMessages, 5000); // Обновляем сообщения каждые 5 секунд