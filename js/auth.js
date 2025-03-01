/* auth.js (скрипты для login.html и register.html) */

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    // Простая проверка данных
    if (username.trim() === '' || password.trim() === '') {
        errorMessage.textContent = 'Пожалуйста, заполните все поля.';
        return;
    }

    // Сохраняем имя пользователя в localStorage
    localStorage.setItem('username', username);

    // Перенаправляем на главную страницу
    window.location.href = 'index.html'; // Изменен путь
}


// Функция register() (из register.html)
function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const errorMessage = document.getElementById('error-message');

    // Простая проверка данных
    if (username.trim() === '' || password.trim() === '' || confirmPassword.trim() === '') {
      errorMessage.textContent = 'Пожалуйста, заполните все поля.';
      return;
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = 'Пароли не совпадают.';
      return;
    }

    // Сохраняем имя пользователя в localStorage
    localStorage.setItem('username', username);

    // Перенаправляем на главную страницу
    window.location.href = '../index.html';  // Изменен путь
  }
