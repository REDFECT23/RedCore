document.addEventListener("DOMContentLoaded", () => {
    let score = 0;
    const scoreDisplay = document.getElementById("score");
    const clickerBtn = document.getElementById("clicker-btn");

    const clickSound = new Audio("assets/click.mp3");

    clickerBtn.addEventListener("click", () => {
        score++;
        scoreDisplay.textContent = score;
        
        // Анимация увеличения текста
        scoreDisplay.style.transform = "scale(1.3)";
        setTimeout(() => scoreDisplay.style.transform = "scale(1)", 200);

        // Анимация кнопки
        clickerBtn.style.transform = "scale(1.2)";
        setTimeout(() => clickerBtn.style.transform = "scale(1)", 100);

        // Эффект частиц
        createParticle(event.clientX, event.clientY);

        // Звук клика
        clickSound.currentTime = 0;
        clickSound.play();
    });

    function createParticle(x, y) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.textContent = "+1";
        document.body.appendChild(particle);

        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }
});