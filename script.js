// Game Constants & Variables
let inputDir = { x: 0, y: 0 };
const foodSound = new Audio('food.mp3');
const gameOverSound = new Audio('gameover.mp3');
const moveSound = new Audio('move.mp3');
const musicSound = new Audio('music.mp3');

let speed = 7;
let score = 0;
let lastPaintTime = 0;
let isPaused = false;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };

const board = document.getElementById('board');
const scoreBox = document.getElementById('scoreBox');
const hiscoreBox = document.getElementById('hiscoreBox');

let hiscore = localStorage.getItem("hiscore");
let hiscoreval = hiscore === null ? 0 : JSON.parse(hiscore);
hiscoreBox.innerHTML = "HiScore: " + hiscoreval;

// Utility to generate food not on snake
function generateFood() {
    let a = 2, b = 16;
    let newFood;
    do {
        newFood = {
            x: Math.floor(a + Math.random() * (b - a)),
            y: Math.floor(a + Math.random() * (b - a))
        };
    } while (snakeArr.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

// Game reset
function resetGame() {
    inputDir = { x: 0, y: 0 };
    snakeArr = [{ x: 13, y: 15 }];
    score = 0;
    scoreBox.innerHTML = "Score: " + score;
    musicSound.play();
    food = generateFood();
}

// Collision detection
function isCollide(snake) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    return (
        snake[0].x >= 18 || snake[0].x <= 0 ||
        snake[0].y >= 18 || snake[0].y <= 0
    );
}

// Game Loop
function main(ctime) {
    window.requestAnimationFrame(main);
    if (isPaused) return;
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        alert("Game Over. Press any key to play again!");
        resetGame();
        return;
    }

    // Eat food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({
            x: snakeArr[0].x + inputDir.x,
            y: snakeArr[0].y + inputDir.y
        });
        food = generateFood();
    }

    // Move snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Render
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        const snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        snakeElement.classList.add(index === 0 ? 'head' : 'snake');
        board.appendChild(snakeElement);
    });

    const foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Controls
window.addEventListener('keydown', e => {
    moveSound.play();

    // Pause/resume with spacebar
    if (e.key === ' ') {
        isPaused = !isPaused;
        return;
    }

    // Prevent reverse movement
    switch (e.key) {
        case "ArrowUp":
            if (inputDir.y !== 1) inputDir = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (inputDir.y !== -1) inputDir = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (inputDir.x !== 1) inputDir = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (inputDir.x !== -1) inputDir = { x: 1, y: 0 };
            break;
    }
});

// Init
musicSound.play();
resetGame();
window.requestAnimationFrame(main);
