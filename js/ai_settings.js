/* ai_settings.js */
// Получаем элементы настроек
const aiProviderSelect = document.getElementById('ai-provider');
const modelSelect = document.getElementById('model-select');
const temperatureInput = document.getElementById('temperature');
const systemPromptInput = document.getElementById('system-prompt');
const topPInput = document.getElementById('top-p');
const topKInput = document.getElementById('top-k');
const maxOutputTokensInput = document.getElementById('max-output-tokens');
const presencePenaltyInput = document.getElementById('presence-penalty');
const frequencyPenaltyInput = document.getElementById('frequency-penalty');
const stopSequencesInput = document.getElementById('stop-sequences');
const imageGenerationCheckbox = document.getElementById('image-generation');
const codeExecutionCheckbox = document.getElementById('code-execution');
const enableWebSearchCheckbox = document.getElementById('enable-web-search');
const maxWebResultsInput = document.getElementById('max-web-results');
const apiCallBudgetInput = document.getElementById('api-call-budget');
const toneStyleSelect = document.getElementById('tone-style');

// Custom functions for localStorage operations
function getLocalStorageValue(key, defaultValue) {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue === null ? defaultValue : storedValue;
  } catch (error) {
    console.error("Ошибка при чтении localStorage:", error);
    return defaultValue;
  }
}

function setLocalStorageValue(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error("Ошибка при записи в localStorage:", error);
  }
}


// Функция для загрузки настроек из localStorage
function loadSettings() {
    aiProviderSelect.value = getLocalStorageValue('aiProvider', 'gemini');
    modelSelect.value = getLocalStorageValue('geminiModel', 'gemini-1.0-pro');
    temperatureInput.value = getLocalStorageValue('geminiTemperature', 0.5);
    systemPromptInput.value = getLocalStorageValue('geminiSystemPrompt', "You are a helpful assistant. You must respond in Russian!");
    topPInput.value = getLocalStorageValue('geminiTopP', 0.95);
    topKInput.value = getLocalStorageValue('geminiTopK', 40);
    maxOutputTokensInput.value = getLocalStorageValue('geminiMaxOutputTokens', 1024);
    presencePenaltyInput.value = getLocalStorageValue('geminiPresencePenalty', 0);
    frequencyPenaltyInput.value = getLocalStorageValue('geminiFrequencyPenalty', 0);
    stopSequencesInput.value = getLocalStorageValue('geminiStopSequences', "");
    imageGenerationCheckbox.checked = getLocalStorageValue('geminiImageGeneration', 'false') === 'true';
    codeExecutionCheckbox.checked = getLocalStorageValue('geminiCodeExecution', 'false') === 'true';
    enableWebSearchCheckbox.checked = getLocalStorageValue('geminiWebSearch', 'false') === 'true';
    maxWebResultsInput.value = getLocalStorageValue('geminiMaxWebResults', 5);
    apiCallBudgetInput.value = getLocalStorageValue('geminiApiCallBudget', 10);
    toneStyleSelect.value = getLocalStorageValue('geminiToneStyle', "neutral");
}

// Функция для сохранения настроек в localStorage
function saveSettings() {
    setLocalStorageValue('aiProvider', aiProviderSelect.value);
    setLocalStorageValue('geminiModel', modelSelect.value);
    setLocalStorageValue('geminiTemperature', temperatureInput.value);
    setLocalStorageValue('geminiSystemPrompt', systemPromptInput.value);
    setLocalStorageValue('geminiTopP', topPInput.value);
    setLocalStorageValue('geminiTopK', topKInput.value);
    setLocalStorageValue('geminiMaxOutputTokens', maxOutputTokensInput.value);
    setLocalStorageValue('geminiPresencePenalty', presencePenaltyInput.value);
    setLocalStorageValue('geminiFrequencyPenalty', frequencyPenaltyInput.value);
    setLocalStorageValue('geminiStopSequences', stopSequencesInput.value);
    setLocalStorageValue('geminiImageGeneration', imageGenerationCheckbox.checked);
    setLocalStorageValue('geminiCodeExecution', codeExecutionCheckbox.checked);
    setLocalStorageValue('geminiWebSearch', enableWebSearchCheckbox.checked);
    setLocalStorageValue('geminiMaxWebResults', maxWebResultsInput.value);
    setLocalStorageValue('geminiApiCallBudget', apiCallBudgetInput.value);
    setLocalStorageValue('geminiToneStyle', toneStyleSelect.value);

    alert('Настройки сохранены!'); // Изменено сообщение
}


let fontFamily = getLocalStorageValue('fontFamily', "'Orbitron', sans-serif");
let customFontPath = getLocalStorageValue('customFontPath', '');

if (fontFamily === "CustomFont" && customFontPath) {
    document.documentElement.style.setProperty('--font-family', "CustomFont, Orbitron, sans-serif");
    document.documentElement.style.setProperty('--custom-font-path', `url(${customFontPath})`);
    console.log("Пытаюсь применить кастомный шрифт:", customFontPath);
} else {
    document.documentElement.style.setProperty('--font-family', fontFamily);
    console.log("Стандартный шрифт:", fontFamily);
}


const body = document.body;
const theme = localStorage.getItem('theme');
if (theme) {
  body.className = theme;
}

function applyCustomizations() {
  let textColor = getLocalStorageValue('textColor', '#0ff');
  let backgroundColor = getLocalStorageValue('backgroundColor', '#222');

  document.documentElement.style.setProperty('--text-color', textColor);
  document.documentElement.style.setProperty('--background-color', backgroundColor);
}

applyCustomizations();
loadSettings();