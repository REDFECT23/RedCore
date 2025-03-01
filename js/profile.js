document.addEventListener("DOMContentLoaded", () => {
    loadProfileData();

    document.getElementById("edit-profile-form").addEventListener("submit", (e) => {
        e.preventDefault();
        saveProfileChanges();
    });
});

function loadProfileData() {
    let playerData = JSON.parse(localStorage.getItem("playerData")) || { username: "Игрок" }; // Временно берем из localStorage для имени
    const usernameSpan = document.getElementById("username");
    const bitsSpan = document.getElementById("bits");
    const levelSpan = document.getElementById("level");
    const xpSpan = document.getElementById("xp");

    usernameSpan.textContent = playerData.username || "Игрок"; // Отображаем имя или "Игрок" по умолчанию
    bitsSpan.textContent = playerData.bits || 0;
    levelSpan.textContent = playerData.level || 1;
    xpSpan.textContent = playerData.xp || 0;
    document.getElementById("edit-username").value = playerData.username || ""; // Заполняем поле редактирования текущим именем
}

function saveProfileChanges() {
    const newUsername = document.getElementById("edit-username").value;

    if (!newUsername || newUsername.trim() === "") {
        return alert("Пожалуйста, введите новое имя.");
    }

    // --- Отправка запроса на сервер для обновления имени ---
    fetch('/.netlify/functions/update-profile', { // 👈 URL Netlify Function для обновления профиля
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentPlayerUsername, newUsername: newUsername }) // 👈 Отправляем текущее и новое имя
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(data.message); // Сообщение об успехе
            // Обновляем имя на странице профиля
            document.getElementById("username").textContent = newUsername;
            // Обновляем имя в localStorage (если вы используете его для отображения имени в других местах)
            let playerData = JSON.parse(localStorage.getItem("playerData")) || {};
            playerData.username = newUsername;
            localStorage.setItem("playerData", JSON.stringify(playerData));
            currentPlayerUsername = newUsername; // Обновляем глобальную переменную currentPlayerUsername
            updatePlayerInfo(); // Обновляем информацию игрока на главной странице (если она отображается)
        } else {
            alert(`Ошибка сохранения: ${data.error}`); // Сообщение об ошибке
        }
    })
    .catch(error => {
        console.error('Ошибка при отправке запроса на сохранение профиля:', error);
        alert('Не удалось сохранить изменения профиля. Попробуйте позже.');
    });
}