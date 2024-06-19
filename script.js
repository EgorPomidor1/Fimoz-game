const bar = document.getElementById('bar');
const successMessage = document.getElementById('successMessage');
const successText = document.getElementById('successText');
const timerDisplay = document.getElementById('timer');
const restartButton = document.getElementById('restartButton');
const modal = document.getElementById('modal');
const fillAmount = 15; // Количество пикселей, на которое увеличивается шкала при каждом свайпе
const decayRate = 1;  // Количество пикселей, на которое уменьшается шкала каждую итерацию
const successThreshold = 100; // Порог заполнения для сообщения о успехе

let startTime;
let timerInterval;
let decayInterval;
let timerRunning = false;
let touchStartY;
let touchEndY;

document.querySelector('.container').addEventListener('touchstart', handleTouchStart, false);
document.querySelector('.container').addEventListener('touchmove', handleTouchMove, false);
document.querySelector('.container').addEventListener('touchend', handleTouchEnd, false);

function handleTouchStart(event) {
    event.preventDefault(); // Отключение перезагрузки страницы при свайпе
    if (!timerRunning) {
        startTimer();
        startDecay();
        timerRunning = true;
    }
    touchStartY = event.touches[0].clientY;
}

function handleTouchMove(event) {
    touchEndY = event.touches[0].clientY;
}

function handleTouchEnd() {
    if (touchEndY > touchStartY) { // Свайп вниз
        event.preventDefault(); // Отключение перезагрузки страницы при свайпе
        const currentHeight = parseInt(window.getComputedStyle(bar).height);
        const containerHeight = parseInt(window.getComputedStyle(document.querySelector('.bar-background')).height);

        let newHeight = currentHeight + fillAmount;
        if (newHeight > containerHeight) {
            newHeight = containerHeight;
        }

        bar.style.height = newHeight + 'px';

        if (newHeight >= successThreshold) {
            showSuccessMessage();
        }
    }
    touchStartY = null;
    touchEndY = null;
}


function startTimer() {
    startTime = new Date().getTime();

    timerInterval = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        updateTimer(elapsedTime);
    }, 10); // Обновляем таймер каждые 10 миллисекунд (для миллисекунд)

    console.log('Timer started');
}

function updateTimer(elapsedTime) {
    let minutes = Math.floor(elapsedTime / (1000 * 60));
    let seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    let milliseconds = elapsedTime % 1000;

    // Добавляем ведущие нули к времени
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    milliseconds = ('00' + milliseconds).slice(-3);

    timerDisplay.textContent = `Время: ${minutes}:${seconds}:${milliseconds}`;
}

function stopTimer() {
    clearInterval(timerInterval);
    console.log('Timer stopped');
}

function showSuccessMessage() {
    stopDecay();
    stopTimer();
    modal.style.display = 'block';

    // Добавляем текст о победе и кнопку рестарт
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    updateTimer(elapsedTime);

    restartButton.addEventListener('click', resetGame);
}

function resetGame() {
    modal.style.display = 'none';
    bar.style.height = '0';
    stopTimer();
    timerRunning = false;
    startDecay();
}

function startDecay() {
    decayInterval = setInterval(decay, 100);
}

function stopDecay() {
    clearInterval(decayInterval);
}

function decay() {
    const currentHeight = parseInt(window.getComputedStyle(bar).height);
    if (currentHeight > 0) {
        bar.style.height = (currentHeight - decayRate) + 'px';
    }
}

// Уменьшаем шкалу каждые 100 миллисекунд
startDecay();
