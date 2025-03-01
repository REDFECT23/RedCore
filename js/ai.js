/* ai.js */
const API_KEY_GEMINI = "нету";
const API_KEY_DEEPSEEK = "а вот не скажу";

const aiMessages = document.getElementById('ai-messages');
const promptInput = document.getElementById('prompt-input');
const chatList = document.getElementById('chat-list');
const loadingIndicator = document.getElementById('loading-indicator');

// Logging function
function logMessage(level, message, ...args) {
    const timestamp = new Date().toISOString();
    console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}`, ...args);
}

// Use functions for localStorage operations
function getLocalStorageValue(key, defaultValue) {
    try {
        const storedValue = localStorage.getItem(key);
        return storedValue === null ? defaultValue : storedValue;
    } catch (error) {
        logMessage("error", "Ошибка при чтении из localStorage", error);
        return defaultValue;
    }
}

function setLocalStorageValue(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (error) {
        logMessage("error", "Ошибка при записи в localStorage", error);
    }
}

let username = getLocalStorageValue('username', 'User');
let fontFamily = getLocalStorageValue('fontFamily', "'Orbitron', sans-serif");
let customFontPath = getLocalStorageValue('customFontPath', '');

if (!username) {
    window.location.href = '../pages/login.html';
}


if (fontFamily === "CustomFont" && customFontPath) {
    document.documentElement.style.setProperty('--font-family', "CustomFont, Orbitron, sans-serif");
    document.documentElement.style.setProperty('--custom-font-path', `url(${customFontPath})`);
    logMessage("info", "Пытаюсь применить кастомный шрифт в Chat:", customFontPath);
} else {
    document.documentElement.style.setProperty('--font-family', fontFamily);
    logMessage("info", "Стандартный шрифт:", fontFamily);
}


let aiProvider = getLocalStorageValue('aiProvider', 'gemini');
let MODEL_NAME = getLocalStorageValue('geminiModel', 'gemini-1.0-pro');

// Chat management using localStorage
function getChats() {
    try {
        const chats = JSON.parse(getLocalStorageValue('aiChats', '{}'));
        return chats;
    } catch (error) {
        logMessage('error', 'Ошибка при разборе JSON из localStorage', error);
        return {};
    }
}

function saveChats(chats) {
    try {
        setLocalStorageValue('aiChats', JSON.stringify(chats));
    } catch (error) {
        logMessage('error', 'Ошибка при сериализации и сохранении чатов в localStorage', error);
    }
}

function createChatId() {
    return Math.random().toString(36).substring(2, 15);
}

function createNewChat() {
    const chatId = createChatId();
    const chats = getChats();

    chats[chatId] = {
        messages: [],
        systemPrompt: getLocalStorageValue('geminiSystemPrompt', 'You are a helpful assistant. You must respond in Russian!')
    };
    saveChats(chats);

    loadChat(chatId);
    displayChatList();
    logMessage('info', `Создан новый чат с ID: ${chatId}`);
    console.log("Все чаты:", chats);
}


// Функция для редактирования системного промта для текущего чата
function editSystemPrompt(chatId) {
    const chats = getChats();
    const currentPrompt = chats[chatId]?.systemPrompt || getLocalStorageValue('geminiSystemPrompt', 'You are a helpful assistant. You must respond in Russian!');
    const newPrompt = prompt("Введите новый системный промпт для этого чата:", currentPrompt);
    if (newPrompt !== null) {
        chats[chatId].systemPrompt = newPrompt;
        saveChats(chats);
        loadChat(chatId); // Обновите чат, чтобы применился новый промт
        logMessage('info', `Системный промпт для чата ${chatId} изменен.`);
    }
}

function loadChat(chatId) {
    currentChatId = chatId;
    aiMessages.innerHTML = '';
    displayChatList();

    const chats = getChats();
    if (chats[chatId]) {
        const messages = chats[chatId].messages || [];
        messages.forEach(message => {
            addMessage(message.text, message.sender);
        });
        logMessage('info', `Чат ${chatId} загружен.`);
    } else {
        logMessage('warn', `Чат ${chatId} не найден.`);
    }
}

function deleteChat(chatId) {
    if (confirm("Вы уверены, что хотите удалить этот чат?")) {
        const chats = getChats();
        delete chats[chatId];
        saveChats(chats);

        currentChatId = null;

        aiMessages.innerHTML = '';
        displayChatList();
        logMessage('info', `Чат ${chatId} удален.`);
    }
}

function displayChatList() {
    chatList.innerHTML = '';
    const chats = getChats();

    for (const chatId in chats) {
        const isActive = chatId === currentChatId;
        const button = document.createElement('button');
        button.textContent = `Чат ${Object.keys(chats).indexOf(chatId) + 1}`;
        button.classList.toggle('active', isActive);
        button.onclick = () => loadChat(chatId);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-chat-button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>';
        deleteButton.onclick = (event) => {
            event.stopPropagation();
            deleteChat(chatId);
        };
        button.appendChild(deleteButton);

        // Кнопка настроек промта
        const promptSettingsButton = document.createElement('button');
        promptSettingsButton.classList.add('prompt-settings-button');
        promptSettingsButton.innerHTML = '<i class="fas fa-cog"></i>';
        promptSettingsButton.onclick = (event) => {
            event.stopPropagation(); // Остановить дальнейшее распространение события
            editSystemPrompt(chatId);
        };

        button.appendChild(promptSettingsButton);
        chatList.appendChild(button);
    }
}

let currentChatId = null;
let startTime;

async function sendMessage() {
    const prompt = promptInput.value.trim();
    if (!prompt || !currentChatId) {
        logMessage('warn', 'Попытка отправить пустое сообщение или нет активного чата.');
        return;
    }

    addMessage(prompt, 'user');
    promptInput.value = '';

    const chats = getChats();
    const systemPromptForChat = chats[currentChatId].systemPrompt;

    const apiKey = aiProvider === 'gemini' ? API_KEY_GEMINI : API_KEY_DEEPSEEK;
    const apiUrl = aiProvider === 'gemini'
        ? `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`
        : 'URL DeepSeek API'; // Замените на фактический URL DeepSeek

    loadingIndicator.style.display = 'flex';
    startTime = new Date().getTime();
    updateGenerationTime();
    let temperature = parseFloat(getLocalStorageValue('geminiTemperature', 0.5));

    try {
        logMessage('info', `Отправка запроса к API ${aiProvider} (${MODEL_NAME}) для чата ${currentChatId}.`);
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{text: systemPromptForChat + "\n" + prompt}],
                }],
            });

        if (!response.ok) {
            const errorText = await response.text();
            logMessage('error', `HTTP error! status: ${response.status}, message: ${errorText}`);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }

        const data = await response.json();
        logMessage('debug', 'Ответ от API:', data);

        if (data.candidates && data.candidates.length > 0) {
            const aiResponse = data.candidates[0].content.parts[0].text;
            addMessage(aiResponse, 'ai');

            saveMessage(prompt, 'user');
            saveMessage(aiResponse, 'ai');
            logMessage('info', `Успешно получен ответ от API.`);
        } else {
            const errorMessage = 'Извините, не удалось получить ответ от ИИ.';
            addMessage(errorMessage, 'ai');
            logMessage('warn', `Не удалось получить ответ от API: нет кандидатов в ответе.`, data);
        }

    } catch (error) {
        logMessage('error', 'Произошла ошибка при отправке запроса к ИИ.', error);
        addMessage(`Произошла ошибка при отправке запроса к ИИ: ${error.message}`, 'ai');
    } finally {
        loadingIndicator.style.display = 'none';
    }
}

function updateGenerationTime() {
    if (loadingIndicator.style.display === 'flex') {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        document.getElementById('generation-time').textContent = elapsedTime.toFixed(1);
        setTimeout(updateGenerationTime, 100);
    }
}

function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
       // Проверяем, является ли сообщение программным кодом (на основе каких-либо признаков, например, начинается с ```)
    if (text.startsWith('```')) {
      const codeText = text.slice(3, -3);  // Убираем ``` в начале и конце
      const codeElement = document.createElement('code');
      codeElement.textContent = codeText;

      // Добавляем обработчик клика для копирования кода
      codeElement.addEventListener('click', () => {
          navigator.clipboard.writeText(codeText)
              .then(() => logMessage('info', 'Код скопирован в буфер обмена'))
              .catch(err => logMessage('error', 'Ошибка при копировании кода: ', err));
      });

      messageElement.appendChild(codeElement);
    } else {
      messageElement.textContent = text;
    }

    aiMessages.appendChild(messageElement);
    aiMessages.scrollTop = aiMessages.scrollHeight;
}

function saveMessage(text, sender) {
    const chats = getChats();
    const message = {text: text, sender: sender};

    if (!chats[currentChatId]) {
        chats[currentChatId] = {
            messages: [],
            systemPrompt: getLocalStorageValue('geminiSystemPrompt', 'You are a helpful assistant. You must respond in Russian!')
        };
    }
    chats[currentChatId].messages.push(message);
    saveChats(chats);
    logMessage('debug', `Сообщение сохранено в чат ${currentChatId}:`, message);
}

const body = document.body;
const theme = localStorage.getItem('theme');
if (theme) {
    body.className = theme;
}

function applyCustomizations() {
    let textColor = localStorage.getItem('textColor') || '#0ff';
    let backgroundColor = localStorage.getItem('backgroundColor') || '#222';

    document.documentElement.style.setProperty('--text-color', textColor);
    document.documentElement.style.setProperty('--background-color', backgroundColor);
}

applyCustomizations();

displayChatList();
if (Object.keys(getChats()).length > 0) {
    loadChat(Object.keys(getChats())[0]);
} else {
    createNewChat();
}
